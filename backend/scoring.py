from database import init_db, get_db
import fastf1
import json

init_db()

MAX_DRIVERS = 22

def calculate_points(predictions, actual_results, multiplier=0.5):
    points = 0
    predictions = json.loads(predictions[0]["prediction_json"])
    actual_positions = {
        driver: index + 1
        for index, driver in enumerate(actual_results["Driver"])
    }
    print(actual_positions)
    for index, driver in enumerate(predictions):
        pos_difference = abs((index + 1) - actual_positions[driver])
        if pos_difference == 0:
            points += 5
        elif pos_difference == 1:
            points += 3
        elif pos_difference == 2:
            points += 1

    points = int(points * multiplier)
    
    return points

def score_session(season, round_number, session_type):
    db = get_db()
   
    predictions = db.execute(
        """
        SELECT * FROM predictions
        WHERE season = ? AND round_number = ? AND session_type = ?
        """,
        (season, round_number, session_type)
    ).fetchall()

    if not predictions:
        print(f"No predictions found for Season {season}, Round {round_number}, Session {session_type}.")
        return
   
    actual_results = fastf1.get_session(season, round_number, session_type)

    if not actual_results:
        print(f"No actual results found for Season {season}, Round {round_number}, Session {session_type}.")
        return
    
    actual_results.load()

    multiplier = 1.0 if session_type == "Race" else 0.5

    points = calculate_points(predictions, actual_results.laps.sort_values(by='LapTime').drop_duplicates(subset=["Driver"], keep="first").iloc[0:MAX_DRIVERS].loc[:, ["Driver", "LapTime"]].reset_index(drop=True), multiplier)
    print(f"Total points calculated for Season {season}, Round {round_number}, Session {session_type}: {points}")

    
