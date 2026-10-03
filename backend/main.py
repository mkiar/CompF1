from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import fastf1
from database import init_db, get_db
from pwdlib import PasswordHash
from pydantic import BaseModel, Field, field_validator, model_validator
from email_validator import validate_email
import secrets
from functools import lru_cache
from datetime import date, datetime, timezone
import json

class SignupRequest(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    email: str
    password: str = Field(min_length=8, max_length=64)
    confirm_password: str = Field(min_length=8, max_length=64)

    @field_validator("username")
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError("Username must be alphanumeric")
        return v

    @field_validator("email")
    def email_valid(cls, v):
        try:
            validate_email(v)
        except Exception:
            raise ValueError("Invalid email address")
        return v

    @model_validator(mode="after")
    def passwords_match(self) -> "SignupRequest":
        if self.password != self.confirm_password:
            raise ValueError("Password and confirm password do not match")
        return self

class LoginRequest(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    password: str = Field(min_length=8, max_length=64)

    @field_validator("username")
    def username_alphanumeric(cls, v):
        if not v.isalnum():                
            raise ValueError("Username must be alphanumeric")
        return v

class LeagueRequest(BaseModel):
    name: str = Field(min_length=3, max_length=20)
    public: bool
    member_limit: int = Field(gt=0, lt=26)

    @field_validator("name")
    def valid_league_name(cls, v):
        if not all(c.isalpha() or c.isspace() for c in v):
            raise ValueError("League name must be alphabetic with whitespaces allowed")
        return v

class JoinLeagueRequest(BaseModel):
    league_id: int = Field(gt=0)
    join_code: str = Field(min_length=8, max_length=8, max_digits=8)

class LeaveLeagueRequest(BaseModel):
    league_id: int = Field(gt=0)

class DisbandLeagueRequest(BaseModel):
    league_id: int = Field(gt=0)

P1_DRIVER_CAP = 6
P2_DRIVER_CAP = 6
P3_DRIVER_CAP = 10
SPRINT_QUALI_DRIVER_CAP = 22
SPRINT_RACE_DRIVER_CAP = 22
QUALI_DRIVER_CAP = 22
RACE_DRIVER_CAP = 22

class PredictionRequest(BaseModel):
    session_type: str
    selections: list[str]
    round_num: int = Field(gt=0)

    @field_validator("session_type")
    def session_type_valid(cls, v):
        valid_session_types = ["Practice 1", "Practice 2", "Practice 3", "Sprint Qualifying", "Sprint Race","Qualifying", "Race"]
        if v not in valid_session_types:
            raise ValueError("Invalid session type")
        return v
    
    @model_validator(mode="after")
    def selections_valid(self) -> "PredictionRequest":
        if self.session_type == "Practice 1" and len(self.selections) != P1_DRIVER_CAP:
            raise ValueError(f"Practice 1 requires exactly {P1_DRIVER_CAP} selections")
        elif self.session_type == "Practice 2" and len(self.selections) != P2_DRIVER_CAP:
            raise ValueError(f"Practice 2 requires exactly {P2_DRIVER_CAP} selections")
        elif self.session_type == "Practice 3" and len(self.selections) != P3_DRIVER_CAP:
            raise ValueError(f"Practice 3 requires exactly {P3_DRIVER_CAP} selections")
        elif self.session_type == "Sprint Qualifying" and len(self.selections) != SPRINT_QUALI_DRIVER_CAP:
            raise ValueError(f"Sprint Qualifying requires exactly {SPRINT_QUALI_DRIVER_CAP} selections")
        elif self.session_type == "Sprint Race" and len(self.selections) != SPRINT_RACE_DRIVER_CAP:
            raise ValueError(f"Sprint Race requires exactly {SPRINT_RACE_DRIVER_CAP} selections")
        elif self.session_type == "Qualifying" and len(self.selections) != QUALI_DRIVER_CAP:
            raise ValueError(f"Qualifying requires exactly {QUALI_DRIVER_CAP} selections")
        elif self.session_type == "Race" and len(self.selections) != RACE_DRIVER_CAP:
            raise ValueError(f"Race requires exactly {RACE_DRIVER_CAP} selections")

        drivers = json.load(open("../drivers.json", "r"))

        if set(self.selections).issubset(set(dict.values(drivers))) == False:
            raise ValueError("Selections must contain driver names")

        if len(set(self.selections)) != len(self.selections):
            raise ValueError("Can't have duplicate driver selections")

        return self

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

@lru_cache(maxsize=1)
def load_current_event():
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

@app.get('/api/current-event')
def get_current_event():
    schedule = load_current_event()
    if schedule is None:
        return {"message": "There are no more races for this season."}
    
    return schedule

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

password_hasher = PasswordHash.recommended()

@app.post('/api/signup')
def user_signup(user: SignupRequest):
    db = get_db()
    existing_user = db.execute("""
        SELECT * FROM users
        WHERE email = ? OR username = ?
    """, (user.email, user.username.lower())).fetchone()
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
        db.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not password_hasher.verify(user.password, database_user["password_hash"]):
        db.close()
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
def create_league(request: Request, league: LeagueRequest):
    user = get_user_from_session(request)

    if user is None:
            raise HTTPException(
                status_code=401,
                detail="Not logged in"
            )
    
    db = get_db()

    league_already_exists = db.execute(
        """SELECT * from leagues WHERE name = ?""", (league.name.lower(),)
    ).fetchone()

    if league_already_exists:
        db.close()
        raise HTTPException(status_code=400, detail="League name already exists")

    join_code = 0
    
    while True:
        join_code = generate_join_code()
        league_join_code_exists = db.execute("SELECT * from leagues WHERE join_code = ?", (join_code,)).fetchone()
        if not league_join_code_exists:
            break

    db.execute("""
        INSERT INTO leagues (name, owner_id, owner_username, join_code, public, member_limit, member_count) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (league.name, user["id"], user["username"], join_code, league.public, league.member_limit, 1,))

    result = db.execute(""" 
        SELECT * from leagues WHERE name = ? AND owner_id = ?
    """, (league.name, user["id"],)).fetchone()

    db.execute("""
        INSERT INTO league_members (league_id, user_id, user_username) VALUES (?, ?, ?)
    """, (result["id"], user["id"], user["username"],))

    db.commit()
    db.close()

    return { "message": "Successfully created league" }

@app.get("/api/leagues")
def get_leagues():
    db = get_db()

    leagues_list = db.execute("""
        SELECT * from leagues WHERE public = 1
    """).fetchmany(15)

    db.close()

    leagues = [dict(league) for league in leagues_list]

    return { "leagues": leagues }

@app.get("/api/search-league")
def search_league(join_code: str):
    db = get_db()

    find_league = db.execute("""
        SELECT * from leagues WHERE join_code = ? AND public = 1
    """, (join_code,)).fetchone()

    if not find_league:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid join code or privated league")

    db.close()

    return { "league": dict(find_league) }


@app.post("/api/join-league")
def get_my_leagues(request: Request, joinLeague: JoinLeagueRequest):
    user = get_user_from_session(request)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )

    db = get_db()

    already_in_league = db.execute("""
        SELECT * from league_members WHERE league_id = ? AND user_id = ?
    """, (joinLeague.league_id, user["id"],)).fetchone()

    if already_in_league:
        db.close()
        raise HTTPException(status_code=400, detail="User is already in this league")

    league = db.execute("""
        SELECT * from leagues WHERE join_code = ? AND member_limit < member_count AND public = 1
    """, (joinLeague.join_code,))

    if not league:
        db.close()
        raise HTTPException(status_code=400, detail="Join code is invalid or league is full")

    db.execute("""
        INSERT INTO league_members (league_id, user_id, user_username) VALUES (?, ?, ?)
    """, (joinLeague.league_id, user["id"], user["username"],))

    db.execute("""
        UPDATE leagues SET member_count = member_count + 1 WHERE id = ?
    """, (joinLeague.league_id,))

    db.commit()
    db.close()

    return { "message": "Successfully joined league" }

@app.get("/api/my-leagues")
def get_my_leagues(request: Request):
    user = get_user_from_session(request)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )

    db = get_db()

    my_leagues = db.execute("""
        SELECT l.* from leagues l INNER JOIN league_members m ON l.id = m.league_id WHERE m.user_id = ?
    """, (user["id"],)).fetchall()

    if not my_leagues:
        db.close()
        return { "leagues": [] }

    db.close()

    leagues = [dict(league) for league in my_leagues]
    return { "leagues": leagues }

@app.post("/api/leave-league")
def leave_league(request: Request, league: LeaveLeagueRequest):
    user = get_user_from_session(request)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )
    
    db = get_db()

    find_league = db.execute("""
        SELECT * from league_members WHERE league_id = ? AND user_id = ?
    """, (league.league_id, user["id"],)).fetchone()

    if not find_league:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid league")

    db.execute("""
        DELETE from league_members WHERE league_id = ? and user_id = ?
    """, (league.league_id, user["id"],))

    db.execute("""
        UPDATE leagues SET member_count = member_count - 1 WHERE id = ?
    """, (league.league_id,))

    db.commit()
    db.close()

    return { "message": "Successfully left league" }

@app.post("/api/disband-league")
def disband_league(request: Request, league: DisbandLeagueRequest):
    user = get_user_from_session(request)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )
    
    db = get_db()

    find_league = db.execute("""
        SELECT * from leagues WHERE id = ? AND owner_id = ?
    """, (league.league_id, user["id"],)).fetchone()

    if not find_league:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid league")

    db.execute("""
        DELETE from leagues WHERE id = ? and owner_id = ?
    """, (league.league_id, user["id"],))
    db.execute("""
        DELETE from league_members WHERE league_id = ?
    """, (league.league_id,))

    db.commit()
    db.close()

    return { "message": "Successfully disbanded league" }

@app.post("/api/predictions")
def make_prediction(request: Request, prediction: PredictionRequest):
    user = get_user_from_session(request)
    
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )
    
    event = load_current_event()
    current_time = datetime.now(timezone.utc)
    first_session_start_time = event["s1_date"]
    
    if current_time > first_session_start_time:
        raise HTTPException(
            status_code=401,
            detail="Making predictions is closed"
        )
    
    
    db = get_db()

    made_prediction = db.execute(""" 
        SELECT * from predictions WHERE user_id = ? AND season = ? AND round_number = ? AND session_type = ?
    """, (user["id"], date.today().year, prediction.round_num, prediction.session_type,)).fetchone()

    if made_prediction:
        db.execute("""
            UPDATE predictions SET prediction_json = ? WHERE user_id = ? AND season = ? AND round_number = ? AND session_type = ?
        """, (json.dumps(prediction.selections), user["id"], date.today().year, prediction.round_num, prediction.session_type,))
    else:
        db.execute("""
            INSERT INTO predictions (user_id, season, round_number, session_type, prediction_json) VALUES (?, ?, ?, ?, ?)
        """, (user["id"], date.today().year, prediction.round_num, prediction.session_type, json.dumps(prediction.selections),))

    db.commit()
    db.close()

    return {
        "message": "Successfully made prediction"
    }

@app.get("/api/predictions")
def check_predictions(request: Request):
    user = get_user_from_session(request)
    event = load_current_event()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Not logged in"
        )

    if event is None:
        return {"message": "There are no races to check predictions"}

    db = get_db()

    get_predictions = db.execute("""
        SELECT * from predictions WHERE user_id = ? AND season = ? AND round_number = ?
    """, (user["id"], date.today().year, event["round_num"],)).fetchall()

    if get_predictions is None:
        db.close()
        return { "message": "No predictions to show for this race" }

    predictions = [dict(prediction) for prediction in get_predictions]

    db.close()

    return { "predictions": predictions }