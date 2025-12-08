
import torch

model_path = 'd:/B.Tech/4th Year pro/agritech/models/millet_mobilenetv2_pytorch.pth'
try:
    # Try loading on CPU
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))
    print(f"Type of checkpoint: {type(checkpoint)}")
    
    if isinstance(checkpoint, dict):
        print("Keys in checkpoint:", checkpoint.keys())
        if 'state_dict' in checkpoint:
            print("Found 'state_dict' key.")
        if 'classes' in checkpoint:
            print(f"Found classes: {checkpoint['classes']}")
        elif 'labels' in checkpoint:
            print(f"Found labels: {checkpoint['labels']}")
        else:
            print("No explicit classes/labels found in dict.")
    else:
        print("Checkpoint is likely a model object (serialized full model).")
        
except Exception as e:
    print(f"Error loading model: {e}")
