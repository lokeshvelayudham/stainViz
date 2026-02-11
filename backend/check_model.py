from backend.inference import CycleGANInference
import os

# Adjust path if running from stainViz root
if os.path.exists("model"):
    checkpoints_dir = "model"
else:
    # Try absolute
    checkpoints_dir = "/Users/loki/DEV/AI/stainViz/model"

try:
    inference = CycleGANInference(checkpoints_dir)
    print("Test: Model loaded successfully!")
except Exception as e:
    print(f"Test: Model loading failed: {e}")
