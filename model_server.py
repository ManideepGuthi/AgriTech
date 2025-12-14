
import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

MODEL_PATH = 'd:/B.Tech/4th Year pro/agritech/models/millet_mobilenetv2_pytorch.pth'
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Using device: {DEVICE}")

# Global variables
model = None
class_names = []

def load_model():
    global model, class_names
    try:
        print(f"Loading model from {MODEL_PATH}...")
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
        
        # 1. Determine Class Names
        if isinstance(checkpoint, dict) and 'classes' in checkpoint:
            class_names = checkpoint['classes']
            print(f"Found {len(class_names)} classes: {class_names}")
        else:
            # Fallback if classes not saved in checkpoint
            print("Warning: 'classes' not found in checkpoint. Using default millet classes. PLEASE VERIFY THESE ARE CORRECT!")
            # IMPORTANT: If your model was trained with different class names, you MUST update this list.
            # Otherwise, predictions will be incorrect.
            class_names = ['Downy Mildew', 'Blast', 'Rust', 'Smut', 'Healthy'] # Guessed fallback
        
        num_classes = len(class_names)
        
        # 2. Initialize Architecture (MobileNetV2)
        model = models.mobilenet_v2(pretrained=False) # We load custom weights
        
        # Replace classifier head to match num_classes
        # MobileNetV2 classifier is: Sequential(Dropout, Linear)
        # We need to match the saved weight shape.
        model.classifier[1] = nn.Linear(model.last_channel, num_classes)
        
        # 3. Load Weights
        if isinstance(checkpoint, dict):
            if 'state_dict' in checkpoint:
                state_dict = checkpoint['state_dict']
            else:
                state_dict = checkpoint
            
            # Remove 'classes' or other metadata keys if present in the dict root
            state_dict = {k: v for k, v in state_dict.items() if k not in ['classes', 'epoch', 'arch', 'optimizer']}
            
            # Handle DataParallel keys (prefix 'module.')
            new_state_dict = {}
            for k, v in state_dict.items():
                name = k.replace("module.", "") 
                new_state_dict[name] = v
            state_dict = new_state_dict
            
            load_result = model.load_state_dict(state_dict, strict=False)
            print(f"Weights loaded. Missing keys: {len(load_result.missing_keys)}, Unexpected keys: {len(load_result.unexpected_keys)}")
            
        else:
            # If checkpoint is the model itself
            model = checkpoint
            
        model.to(DEVICE)
        model.eval()
        print("Model loaded successfully!")
        
    except Exception as e:
        print(f"CRITICAL ERROR loading model: {e}")
        model = None

# Validation / Preprocessing
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running", "model_loaded": model is not None})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "AgriTech Model Server is Running",
        "endpoints": {
            "/health": "GET - Check status",
            "/predict": "POST - Analyze image key='image'"
        }
    })

@app.route('/.well-known/appspecific/com.chrome.devtools.json', methods=['GET'])
def devtools_probe():
    return jsonify({})

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
        
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        image = Image.open(file.stream).convert('RGB')
        tensor = transform(image).unsqueeze(0).to(DEVICE)
        
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_idx = torch.max(probabilities, 1)
            
            predicted_class = class_names[predicted_idx.item()]
            score = confidence.item()
            
        return jsonify({
            "class": predicted_class,
            "confidence": score,
            "is_plant": True # We assume if the user uploads it to this specific model, and it gives a class, we treat it as a plant for now. Validation is hard without a 'Background' class.
        })
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000)
