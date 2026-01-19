import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_calculate_calories_running():
    """Test calculating calories for running"""
    response = client.post(
        "/calculate-calories",
        json={
            "activity": "running",
            "duration_minutes": 30,
            "weight_kg": 60
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["activity"] == "running"
    assert data["duration_minutes"] == 30
    assert data["weight_kg"] == 60
    # MET value for running is 7.5
    # Calories = 7.5 * 60 * (30/60) = 225.0
    assert data["calories_burned"] == 225.0

def test_calculate_calories_walking():
    """Test calculating calories for walking"""
    response = client.post(
        "/calculate-calories",
        json={
            "activity": "walking",
            "duration_minutes": 60,
            "weight_kg": 70
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["activity"] == "walking"
    assert data["duration_minutes"] == 60
    assert data["weight_kg"] == 70
    # MET value for walking is 3.5
    # Calories = 3.5 * 70 * (60/60) = 245.0
    assert data["calories_burned"] == 245.0

def test_calculate_calories_cycling():
    """Test calculating calories for cycling"""
    response = client.post(
        "/calculate-calories",
        json={
            "activity": "cycling",
            "duration_minutes": 45,
            "weight_kg": 80
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["activity"] == "cycling"
    assert data["duration_minutes"] == 45
    assert data["weight_kg"] == 80
    # MET value for cycling is 6.0
    # Calories = 6.0 * 80 * (45/60) = 360.0
    assert data["calories_burned"] == 360.0

def test_invalid_activity():
    """Test with invalid activity"""
    response = client.post(
        "/calculate-calories",
        json={
            "activity": "swimming",
            "duration_minutes": 30,
            "weight_kg": 60
        }
    )
    assert response.status_code == 422  # Validation error

def test_negative_duration():
    """Test with negative duration"""
    response = client.post(
        "/calculate-calories",
        json={
            "activity": "running",
            "duration_minutes": -10,
            "weight_kg": 60
        }
    )
    assert response.status_code == 400  # Bad request

def test_negative_weight():
    """Test with negative weight"""
    response = client.post(
        "/calculate-calories",
        json={
            "activity": "running",
            "duration_minutes": 30,
            "weight_kg": -60
        }
    )
    assert response.status_code == 400  # Bad request

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome to the Calorie Burn Calculator API"