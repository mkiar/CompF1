from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import fastf1
from database import init_db, get_db
from pwdlib import PasswordHash
from pydantic import BaseModel
from email_validator import validate_email
import secrets
from datetime import datetime, timezone

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class LeagueRequest(BaseModel):
    name: str
    owner_id: int
    owner_username: str
    public: bool
    member_limit: int

class JoinLeagueRequest(BaseModel):
    league_id: int
    join_code: str
    user_id: int
    user_username: str

class MyLeagueRequest(BaseModel):
    user_id: int

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

def get_user_from_session(request: Request):
    session_token = request.cookies.get("session")

    if not session_token:
        return None

    db = get_db()

    session = db.execute("""
        SELECT users.id,
               users.username,
               sessions.expires_at
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE sessions.token = ? AND sessions.expires_at > datetime('now')
        """, (session_token,)
    ).fetchone()

    db.close()

    if not session:
        return None

    return session

@app.get("/api/me")
def get_current_user(request: Request):
    user = get_user_from_session(request)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )

    return {
        "id": user["id"],
        "username": user["username"],
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
    existing_user = db.execute("""
        SELECT * FROM users
        WHERE email = ? OR username = ?
    """, (user.email, user.username)).fetchone()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Username or email already exists")

    
    hashed = password_hasher.hash(user.password)

    db.execute("""
        INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)
    """, (user.username, user.email, hashed))

    db.commit()
    db.close()

    return { "message": "Account was created successfully" }

@app.post("/api/login")
def login(user: LoginRequest, response: Response):
    db = get_db()

    database_user = db.execute(
        "SELECT * FROM users WHERE username = ?",
        (user.username,)
    ).fetchone()

    if not database_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not password_hasher.verify(user.password, database_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    session_token = secrets.token_urlsafe(32)

    db.execute("""
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES (?, ?, datetime('now', '+7 days'))
        """,(session_token, database_user["id"])
    )

    db.commit()
    db.close()

    response.set_cookie(
        key="session",
        value=session_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7 # this equates to 7 days
    )

    return {
        "message": "Login successful",
        "user": {
            "id": database_user["id"],
            "username": database_user["username"]
        }
    }

@app.post("/api/logout")
def logout(request: Request, response: Response):
    session_token = request.cookies.get("session")

    if session_token:
        db = get_db()
        db.execute(
            """
            DELETE FROM sessions
            WHERE token = ?
            """,
            (session_token,)
        )
        db.commit()
        db.close()

    response.delete_cookie("session")

    return {
        "message": "Logged out successfully"
    }

def generate_join_code():
    join_code = secrets.randbelow(90000000) + 10000000
    return str(join_code)

@app.post("/api/create-league")
def create_league(league: LeagueRequest):
    db = get_db()

    league_already_exists = db.execute(
        """SELECT * from leagues WHERE name = ?""", (league.name,)
    ).fetchone()

    if league_already_exists:
        raise HTTPException(status_code=400, detail="League name already exists")

    join_code = 0
    
    while True:
        join_code = generate_join_code()
        league_join_code_exists = db.execute("SELECT * from leagues WHERE join_code = ?", (join_code,)).fetchone()
        if not league_join_code_exists:
            break

    db.execute("""
        INSERT INTO leagues (name, owner_id, owner_username, join_code, public, member_limit, member_count) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (league.name, league.owner_id, league.owner_username, join_code, league.public, league.member_limit, 1,))

    result = db.execute(""" 
        SELECT * from leagues WHERE name = ? AND owner_id = ?
    """, (league.name, league.owner_id,)).fetchone()

    db.execute("""
        INSERT INTO league_members (league_id, user_id, user_username) VALUES (?, ?, ?)
    """, (result["id"], league.owner_id, league.owner_username,))

    db.commit()
    db.close()

    return { "message": "Successfully created league" }

@app.get("/api/leagues")
def get_leagues():
    db = get_db()

    leagues_list = db.execute("""
        SELECT * from leagues WHERE public = 1
    """).fetchmany(15)

    leagues = [dict(league) for league in leagues_list]

    return { "leagues": leagues }

@app.post("/api/join-league")
def get_my_leagues(joinLeague: JoinLeagueRequest):
    db = get_db()

    already_in_league = db.execute("""
        SELECT * from league_members WHERE league_id = ? AND user_id = ?
    """, (joinLeague.league_id, joinLeague.user_id,)).fetchone()

    if already_in_league:
        raise HTTPException(status_code=400, detail="User is already in this league")

    league = db.execute("""
        SELECT * from leagues WHERE join_code = ? AND member_limit < member_count AND public = 1
    """, (joinLeague.join_code,))

    if not league:
        raise HTTPException(status_code=400, detail="Join code is invalid or league is full")

    db.execute("""
        INSERT INTO league_members (league_id, user_id, user_username) VALUES (?, ?, ?)
    """, (joinLeague.league_id, joinLeague.user_id, joinLeague.user_username,))

    db.execute("""
        UPDATE leagues SET member_count = member_count + 1 WHERE id = ?
    """, (joinLeague.league_id,))

    db.commit()
    db.close()

    return { "message": "Successfully joined league" }