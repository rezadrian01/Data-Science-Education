import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

class StudentPerformancePredictor:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.feature_columns = [
            'gender', 'region', 'highest_education', 'imd_band', 
            'age_band', 'num_of_prev_attempts', 'studied_credits', 
            'disability', 'avg_score', 'num_assessments'
        ]
        
    def load_and_prepare_data(self):
        """Load and prepare the dataset for training"""
        # Load datasets
        student_info = pd.read_csv('dataset/studentInfo.csv')
        student_assessment = pd.read_csv('dataset/studentAssessment.csv')
        
        # Calculate average scores and number of assessments per student
        assessment_stats = student_assessment.groupby('id_student').agg({
            'score': ['mean', 'count']
        }).round(2)
        
        assessment_stats.columns = ['avg_score', 'num_assessments']
        assessment_stats = assessment_stats.reset_index()
        
        # Merge with student info
        data = student_info.merge(assessment_stats, on='id_student', how='left')
        
        # Fill missing values
        data['avg_score'] = data['avg_score'].fillna(0)
        data['num_assessments'] = data['num_assessments'].fillna(0)
        data['imd_band'] = data['imd_band'].fillna('Unknown')
        
        # Remove rows with missing target
        data = data.dropna(subset=['final_result'])
        
        return data
    
    def encode_categorical_features(self, data, fit=True):
        """Encode categorical features"""
        categorical_features = ['gender', 'region', 'highest_education', 'imd_band', 'age_band', 'disability']
        
        encoded_data = data.copy()
        
        for feature in categorical_features:
            if fit:
                le = LabelEncoder()
                encoded_data[feature] = le.fit_transform(data[feature].astype(str))
                self.label_encoders[feature] = le
            else:
                if feature in self.label_encoders:
                    # Handle unknown categories
                    le = self.label_encoders[feature]
                    encoded_data[feature] = encoded_data[feature].astype(str)
                    
                    # Replace unknown categories with the most frequent one
                    unknown_mask = ~encoded_data[feature].isin(le.classes_)
                    if unknown_mask.any():
                        most_frequent = le.classes_[0]  # Use first class as default
                        encoded_data.loc[unknown_mask, feature] = most_frequent
                    
                    encoded_data[feature] = le.transform(encoded_data[feature])
                
        return encoded_data
    
    def train_model(self):
        """Train the prediction model"""
        print("Loading and preparing data...")
        data = self.load_and_prepare_data()
        
        print("Encoding categorical features...")
        encoded_data = self.encode_categorical_features(data, fit=True)
        
        # Prepare features and target
        X = encoded_data[self.feature_columns]
        y = encoded_data['final_result']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print("Training model...")
        # Train Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nModel Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Save model and encoders
        self.save_model()
        
        return accuracy
    
    def save_model(self):
        """Save the trained model and encoders"""
        model_data = {
            'model': self.model,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }
        joblib.dump(model_data, 'student_performance_model.pkl')
        print("Model saved successfully!")
    
    def load_model(self):
        """Load the trained model and encoders"""
        if os.path.exists('student_performance_model.pkl'):
            model_data = joblib.load('student_performance_model.pkl')
            self.model = model_data['model']
            self.label_encoders = model_data['label_encoders']
            self.feature_columns = model_data['feature_columns']
            print("Model loaded successfully!")
            return True
        else:
            print("No saved model found!")
            return False
    
    def predict(self, student_data):
        """Make prediction for a single student"""
        if self.model is None:
            raise ValueError("Model not loaded. Please train or load a model first.")
        
        # Convert to DataFrame
        df = pd.DataFrame([student_data])
        
        # Encode categorical features
        encoded_df = self.encode_categorical_features(df, fit=False)
        
        # Select features
        X = encoded_df[self.feature_columns]
        
        # Make prediction
        prediction = self.model.predict(X)[0]
        prediction_proba = self.model.predict_proba(X)[0]
        
        # Get class probabilities
        classes = self.model.classes_
        probabilities = {classes[i]: float(prediction_proba[i]) for i in range(len(classes))}
        
        return {
            'prediction': prediction,
            'probabilities': probabilities,
            'confidence': float(max(prediction_proba))
        }

if __name__ == "__main__":
    # Train the model
    predictor = StudentPerformancePredictor()
    predictor.train_model()
