# Calorie Burn Calculator API

A simple FastAPI application that calculates calories burned based on activity, duration, and weight using MET values.

## 🖼️ Application Overview

![Docker Container Running](images/image-1.png "Docker Container Running")

## 🔥 Features

- Calculate calories burned for walking, running, and cycling
- Input validation using Pydantic
- Clean, beginner-friendly code
- Swagger UI interface included
- Docker support for easy deployment

## 🐳 Docker Deployment

![API Running in Docker](images/images-2.png "API Running in Docker Container")

## 🛠️ Tech Stack

- **Framework**: FastAPI
- **Validation**: Pydantic
- **Server**: Uvicorn
- **Containerization**: Docker

## 📦 Installation

### Prerequisites
- Python 3.11+
- Docker (optional)

### Local Setup
```bash
# Clone or download the project
cd calorie-calculator

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --reload
```

The API will be available at [http://localhost:8000](http://localhost:8000)
Swagger UI will be available at [http://localhost:8000/docs](http://localhost:8000/docs)

### Docker Setup
```bash
# Build the Docker image
docker build -t calorie-calculator .

# Run the container
docker run -p 8000:8000 calorie-calculator
```

## 🚀 Usage

### API Endpoint
`POST /calculate-calories`

### Request Body
```json
{
  "activity": "running",
  "duration_minutes": 30,
  "weight_kg": 60
}
```

### Response
```json
{
  "activity": "running",
  "duration_minutes": 30,
  "weight_kg": 60,
  "calories_burned": 225.0
}
```

### Supported Activities
- `walking` (MET value: 3.5)
- `running` (MET value: 7.5)
- `cycling` (MET value: 6.0)

## 🧪 Example Requests

### Using curl
```bash
curl -X POST "http://localhost:8000/calculate-calories" \
  -H "Content-Type: application/json" \
  -d '{
    "activity": "running",
    "duration_minutes": 30,
    "weight_kg": 60
  }'
```

## 📊 Calculation Formula

The calories burned are calculated using the formula:
```
Calories = MET × weight(kg) × duration(hours)
```

Where:
- MET = Metabolic Equivalent of Task (activity-specific value)
- Duration is converted from minutes to hours

## 🐳 Docker

The application is containerized with Docker for easy deployment:

- Base image: `python:3.11-slim`
- Port exposed: 8000
- Runs with Uvicorn ASGI server

## 📄 License

This project is open source and available under the MIT License.