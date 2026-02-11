import torch
import os
from .model import ResnetGenerator
import torch.nn as nn

class CycleGANInference:
    def __init__(self, checkpoints_dir):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        # Check for Mac MPS (Apple Silicon)
        if torch.backends.mps.is_available():
             self.device = torch.device('mps')
        
        print(f"Using device: {self.device}")

        # Initialize Generators (Standard CycleGAN: 3->3, 9 blocks)
        self.netG_A = ResnetGenerator(3, 3, ngf=64, norm_layer=nn.InstanceNorm2d, n_blocks=9)
        self.netG_B = ResnetGenerator(3, 3, ngf=64, norm_layer=nn.InstanceNorm2d, n_blocks=9)
        
        self.netG_A.to(self.device).eval()
        self.netG_B.to(self.device).eval()
        
        # Load weights
        self._load_weights(checkpoints_dir, "Latest_Net_G_A.pth", self.netG_A)
        self._load_weights(checkpoints_dir, "Latest_Net_G_B.pth", self.netG_B)

    def _load_weights(self, checkpoints_dir, filename, model):
        path = os.path.join(checkpoints_dir, filename)
        if not os.path.exists(path):
            print(f"⚠️ Warning: Model weights not found at {path}")
            return
            
        try:
            state_dict = torch.load(path, map_location=self.device)
            model.load_state_dict(state_dict)
            print(f"✅ Loaded {filename}")
        except Exception as e:
            print(f"❌ Error loading {filename}: {e}")

    def predict(self, tensor, direction='AtoB'):
        """
        Runs inference on a batch of patches.
        Args:
            tensor (torch.Tensor): Input tensor (B, 3, 256, 256), range [-1, 1]
            direction (str): 'AtoB' (BF->HE) or 'BtoA' (HE->BF)
        Returns:
            torch.Tensor: Output tensor (B, 3, 256, 256), range [-1, 1]
        """
        model = self.netG_A if direction == 'AtoB' else self.netG_B
        with torch.no_grad():
            output = model(tensor.to(self.device))
        return output
