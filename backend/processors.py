import numpy as np
from PIL import Image
import torch
from torchvision import transforms
import io

# Configuration
PATCH_SIZE = 256
STRIDE = 128 # Overlap for smoothness

def get_weight_mask(patch_size):
    """
    Creates a 2D pyramid weight mask for smooth blending.
    Center = 1.0, Edges = 0.0
    """
    x = np.linspace(-1, 1, patch_size)
    y = np.linspace(-1, 1, patch_size)
    xv, yv = np.meshgrid(x, y)
    mask = (1 - np.abs(xv)) * (1 - np.abs(yv))
    mask = np.maximum(mask, 1e-6)
    return mask[..., None] # (H, W, 1)

def pad_image(image: Image.Image):
    """
    Pads the image to ensure it fits patch size and stride.
    Returns: padded_image (PIL), pad_w, pad_h
    """
    W, H = image.size
    
    n_w = (W - PATCH_SIZE + STRIDE - 1) // STRIDE + 1
    if (n_w - 1) * STRIDE + PATCH_SIZE < W: n_w += 1
    
    n_h = (H - PATCH_SIZE + STRIDE - 1) // STRIDE + 1
    if (n_h - 1) * STRIDE + PATCH_SIZE < H: n_h += 1

    target_w = (n_w - 1) * STRIDE + PATCH_SIZE
    target_h = (n_h - 1) * STRIDE + PATCH_SIZE
    
    pad_w = target_w - W
    pad_h = target_h - H
    
    if pad_w > 0 or pad_h > 0:
        padded_img = Image.new("RGB", (target_w, target_h), (0, 0, 0))
        padded_img.paste(image, (0, 0))
    else:
        padded_img = image
        
    return padded_img, pad_w, pad_h

def create_patches(image: Image.Image):
    """
    Creates patches from the given image.
    Returns a list of PIL Image patches and their (y, x) coordinates.
    """
    img_np = np.array(image)
    full_h, full_w, _ = img_np.shape
    
    patches = []
    coords = []
    
    for y in range(0, full_h - PATCH_SIZE + 1, STRIDE):
        for x in range(0, full_w - PATCH_SIZE + 1, STRIDE):
            patch = img_np[y:y+PATCH_SIZE, x:x+PATCH_SIZE]
            patch_pil = Image.fromarray(patch)
            patches.append(patch_pil)
            coords.append((y, x))
    return patches, coords

def stitch_patches(processed_patches, coords, original_padded_size):
    """
    Stitches processed patches back into a full image.
    Returns: stitched_image (PIL)
    """
    full_w, full_h = original_padded_size
    canvas = np.zeros((full_h, full_w, 3), dtype=np.float32)
    weight = np.zeros((full_h, full_w, 3), dtype=np.float32)
    mask = get_weight_mask(PATCH_SIZE).astype(np.float32)
    
    for (y, x), patch_np in zip(coords, processed_patches):
        # patch_np is (256, 256, 3), mask is (256, 256, 1)
        canvas[y:y+PATCH_SIZE, x:x+PATCH_SIZE] += patch_np.astype(np.float32) * mask
        weight[y:y+PATCH_SIZE, x:x+PATCH_SIZE] += mask
        
    # Normalize
    # void division by zero
    valid_mask = weight > 0
    weight[~valid_mask] = 1.0 # Set to 1 where 0 to avoid NaN, though canvas should be 0 there too
    
    final_rgb = (canvas / weight)
    final_rgb = np.clip(final_rgb, 0, 255).astype(np.uint8)
    
    return Image.fromarray(final_rgb)

def process_image(image_bytes: bytes, model_inference, direction: str = 'AtoB') -> bytes:
    """
    Full pipeline: Read -> Patch -> Inference -> Stitch -> Bytes
    Args:
        image_bytes: Raw image bytes
        model_inference: CycleGANInference instance
        direction: 'AtoB' or 'BtoA'
    """
    # 1. Read Image
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # Resize if too large (Azure B1 has 230s timeout)
    MAX_DIM = 1500
    if max(image.size) > MAX_DIM:
        scale = MAX_DIM / max(image.size)
        new_size = (int(image.size[0] * scale), int(image.size[1] * scale))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
        
    orig_w, orig_h = image.size
    
    # 2. Pad Image
    padded_image, pad_w, pad_h = pad_image(image)
    
    # 3. Patching
    patches, coords = create_patches(padded_image)
    
    # 4. Inference
    # Process in batches to avoid OOM
    BATCH_SIZE = 1 # Reduced for stability on B1 plan
    output_patches = []
    
    # Pre-calculate transform once
    # Use standard CycleGAN transform for test (0.5 mean, 0.5 std results in -1 to 1)
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    ])
    
    total_patches = len(patches)
    # print(f"Total patches to process: {total_patches}")
    
    for i in range(0, total_patches, BATCH_SIZE):
        batch_pil = patches[i:i+BATCH_SIZE]
        
        # Transform batch
        batch_tensors = torch.stack([transform(p) for p in batch_pil])
        
        # Run inference
        with torch.no_grad():
            generated = model_inference.predict(batch_tensors, direction=direction)
            
            # Post-process: Denormalize to 0-255 numpy
            gen_np = generated.cpu().numpy()
            gen_np = (gen_np * 0.5 + 0.5) * 255.0
            gen_np = np.clip(gen_np, 0, 255).astype(np.uint8)
            # Transpose to (B, H, W, C)
            gen_np = np.transpose(gen_np, (0, 2, 3, 1))
            
            output_patches.extend([gen_np[k] for k in range(gen_np.shape[0])])

    # 5. Stitching
    stitched_image = stitch_patches(output_patches, coords, padded_image.size)
    
    # 6. Crop back to original size
    if pad_w > 0 or pad_h > 0:
        final_image = stitched_image.crop((0, 0, orig_w, orig_h))
    else:
        final_image = stitched_image
    
    # 7. Convert to bytes
    img_byte_arr = io.BytesIO()
    final_image.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()
