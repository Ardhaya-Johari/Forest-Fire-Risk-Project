from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load ML model
clf_model = joblib.load('models/rf_clf_pipeline.joblib')
# Load feature columns for one-hot encoding
model_columns = joblib.load('models/model_columns.joblib')

# Load historical fire data
hist_data = pd.read_csv('data/wildfire_cleaned.csv')
hist_data = hist_data[['X','Y','fire','FFMC','DMC','DC','ISI','temp','RH','wind','rain']]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        # Prepare dataframe for model
        df_input = pd.DataFrame([data])
        # One-hot encode month/day
        df_input = pd.get_dummies(df_input, columns=['month','day'], drop_first=True)
        # Add missing columns with 0
        for col in model_columns:
            if col not in df_input.columns:
                df_input[col] = 0
        df_input = df_input[model_columns]  # ensure correct order

        # Prediction
        prob = clf_model.predict_proba(df_input)[0][1]
        pred = clf_model.predict(df_input)[0]

        # Feature importance for numeric features only
        numeric_features = ['X','Y','FFMC','DMC','DC','ISI','temp','RH','wind','rain']
        feature_importance = {f: round(i,3) for f,i in zip(
            numeric_features,
            clf_model.named_steps['rf'].feature_importances_[:len(numeric_features)]
        )}

        result = {
            'prediction': 'Fire Risk!' if pred==1 else 'No Fire',
            'probability': round(prob*100,1),
            'X': float(data['X']),
            'Y': float(data['Y']),
            'feature_importance': feature_importance
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.get_json()
        X_val = float(data['X'])
        Y_val = float(data['Y'])
        forecast_points = []

        # loop for 7 days forecast
        for day_offset in range(7):
            # copy original data
            forecast_data = data.copy()
            # you can simulate day change if you want (here just keep same)
            forecast_data['day'] = data.get('day', 'mon')  # default if missing
            forecast_data['month'] = data.get('month', 'jan')

            # make DataFrame
            df_input = pd.DataFrame([forecast_data])
            df_input = pd.get_dummies(df_input, columns=['month','day'], drop_first=True)

            # align with training columns
            for col in model_columns:
                if col not in df_input.columns:
                    df_input[col] = 0
            df_input = df_input[model_columns]

            # prediction
            prob = clf_model.predict_proba(df_input)[0][1]

            forecast_points.append({
                'X': X_val,
                'Y': Y_val,
                'probability': round(prob*100,1),
                'day': day_offset+1
            })

        return jsonify({'forecast': forecast_points})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/history', methods=['GET'])
def history():
    # return historical fire points for map
    points = hist_data.to_dict(orient='records')
    return jsonify(points)

if __name__=="__main__":
    app.run(debug=True)
