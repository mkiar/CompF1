from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import fastf1
from database import init_db, get_db
from pwdlib import PasswordHash
from pydantic import BaseModel
from email_validator import validate_email

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"FastF1 version: {fastf1.__version__}")
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/api/current-event')
def get_current_event():
    schedule = fastf1.get_events_remaining()
    if (schedule.empty):
        return {"message": "There are no more races for this season."}
    else:
        current_event = schedule.iloc[0]
        return {
            "message": "Current event retrieved successfully.",
            "round_num": str(current_event['RoundNumber']),
            "name": current_event['EventName'],
            "date": current_event['EventDate'].strftime('%Y-%m-%d'),
            "location": current_event['Location'],
            "country": current_event['Country'],
            "s1": current_event['Session1'],
            "s1_date": current_event['Session1Date'],
            "s2": current_event['Session2'],
            "s2_date": current_event['Session2Date'],
            "s3": current_event['Session3'],
            "s3_date": current_event['Session3Date'],
            "s4": current_event['Session4'],
            "s4_date": current_event['Session4Date'],
            "s5": current_event['Session5'],
            "s5_date": current_event['Session5Date']
        }

password_hasher = PasswordHash.recommended();

def validSignupParams(username, email, password, confirm_password):
    if password != confirm_password:
        return False
    if len(username) < 3 or len(username) > 20:
        return False
    if not validate_email(email):
        return False
    if len(password) < 8 or len(password) > 64:
        return False

    return True

@app.post('/api/signup')
def user_signup(user: SignupRequest):
    if not validSignupParams(user.username, user.email, user.password, user.confirm_password):
        return { "message": "Invalid Signup Form Request"}
    db = get_db()
    cursor = db.cursor()
    existing_user = cursor.execute("""
        SELECT * FROM users
        WHERE email = ? OR username = ?
    """, (user.email, user.username)).fetchone()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Username or email already exists")

    
    hashed = password_hasher.hash(user.password)

    cursor.execute("""
        INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)
    """, (user.username, user.email, hashed))

    db.commit()
    db.close()

    return { "message": "Account was created successfully" }

