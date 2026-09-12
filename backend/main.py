from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import fastf1

app = FastAPI()

print(f"FastF1 version: {fastf1.__version__}")
schedule = fastf1.get_events_remaining()
print(schedule.iloc[0])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from Python!"}

@app.get('/api/current-event')
def get_current_event():
    schedule = fastf1.get_events_remaining()
    if (schedule.empty):
        return {"message": "There are no more races for this season."}
    else:
        current_event = schedule.iloc[0]
        return {
            "round_num": str(current_event['RoundNumber']),
            "message": "Current event retrieved successfully.",
            "name": current_event['EventName'],
            "date": current_event['EventDate'].strftime('%Y-%m-%d'),
            "location": current_event['Location'],
            "country": current_event['Country'],
            "format": current_event['EventFormat'],
        }
    
    
