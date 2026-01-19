from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal

app = FastAPI(
    title="Calorie Burn Calculator",
    description="A simple API to calculate calories burned based on activity, duration, and weight",
    version="1.0.0"
)

# Define the request model
class CalorieRequest(BaseModel):
    activity: Literal["walking", "running", "cycling"]
    duration_minutes: int
    weight_kg: float

# MET values for different activities
MET_VALUES = {
    "walking": 3.5,
    "running": 7.5,
    "cycling": 6.0
}

@app.post("/calculate-calories", 
          summary="Calculate Calories Burned",
          description="Calculates the calories burned based on activity, duration, and weight using MET values")
def calculate_calories(request: CalorieRequest):
    # Validate inputs
    if request.duration_minutes <= 0:
        raise HTTPException(status_code=400, detail="Duration must be greater than 0")
    
    if request.weight_kg <= 0:
        raise HTTPException(status_code=400, detail="Weight must be greater than 0")
    
    # Get MET value for the activity
    met_value = MET_VALUES[request.activity]
    
    # Calculate calories burned
    # Formula: Calories = MET × weight(kg) × duration(hours)
    duration_hours = request.duration_minutes / 60
    calories_burned = met_value * request.weight_kg * duration_hours
    
    # Return the result rounded to 2 decimal places
    return {
        "activity": request.activity,
        "duration_minutes": request.duration_minutes,
        "weight_kg": request.weight_kg,
        "calories_burned": round(calories_burned, 2)
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to the Calorie Burn Calculator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)