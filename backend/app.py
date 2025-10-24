from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from model import StudentPerformancePredictor

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://frontend:3000", "http://127.0.0.1:3000"])

# Initialize the predictor
predictor = StudentPerformancePredictor()

# Load the trained model on startup
def load_model():
    if not predictor.load_model():
        print("Training new model...")
        predictor.train_model()

# Load model when app starts
load_model()

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Student Performance Prediction API",
        "status": "running",
        "endpoints": {
            "/predict": "POST - Make prediction",
            "/train": "POST - Train new model",
            "/model-info": "GET - Get model information"
        }
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'gender', 'region', 'highest_education', 'imd_band',
            'age_band', 'num_of_prev_attempts', 'studied_credits',
            'disability', 'avg_score', 'num_assessments'
        ]
        
        # Check if all required fields are present
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields,
                "required_fields": required_fields
            }), 400
        
        # Make prediction
        result = predictor.predict(data)
        
        return jsonify({
            "success": True,
            "prediction": result['prediction'],
            "confidence": result['confidence'],
            "probabilities": result['probabilities'],
            "input_data": data
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    try:
        print("Starting model training...")
        accuracy = predictor.train_model()
        
        return jsonify({
            "success": True,
            "message": "Model trained successfully",
            "accuracy": accuracy
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    try:
        if predictor.model is None:
            return jsonify({
                "model_loaded": False,
                "message": "No model loaded"
            })
        
        return jsonify({
            "model_loaded": True,
            "model_type": "RandomForestClassifier",
            "feature_columns": predictor.feature_columns,
            "classes": list(predictor.model.classes_),
            "categorical_encoders": list(predictor.label_encoders.keys())
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/example-input', methods=['GET'])
def example_input():
    """Return an example input for testing"""
    return jsonify({
        "example_input": {
            "gender": "M",
            "region": "East Anglian Region",
            "highest_education": "HE Qualification",
            "imd_band": "90-100%",
            "age_band": "35-55",
            "num_of_prev_attempts": 0,
            "studied_credits": 240,
            "disability": "N",
            "avg_score": 75.5,
            "num_assessments": 5
        },
        "field_descriptions": {
            "gender": "M (Male) or F (Female)",
            "region": "Student's geographical region",
            "highest_education": "Highest education level achieved",
            "imd_band": "Index of Multiple Deprivation band (socio-economic indicator)",
            "age_band": "Age range: 0-35, 35-55, 55<=",
            "num_of_prev_attempts": "Number of previous attempts at the course",
            "studied_credits": "Number of credits being studied",
            "disability": "Y (Yes) or N (No)",
            "avg_score": "Average assessment score (0-100)",
            "num_assessments": "Number of assessments taken"
        },
        "possible_predictions": ["Pass", "Fail", "Withdrawn", "Distinction"]
    })

if __name__ == '__main__':
    # Change to backend directory
    os.chdir('/home/asus/web projects/11. Data Science Education/backend')
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)
