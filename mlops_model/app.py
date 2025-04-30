
from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load
import numpy as np

app = FastAPI()
model = load('model.pkl')

class InputData(BaseModel):
    features: list

@app.post("/predict")
def predict(data: InputData):
    prediction = model.predict(np.array([data.features]))
    return {"prediction of the model": int(prediction[0])}
