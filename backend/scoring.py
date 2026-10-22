from database import get_db
import fastf1
import json
from fastf1.core import DataNotLoadedError
import math
from datetime import datetime

fastf1.logger.set_log_level('ERROR')

MAX_DRIVERS = 22

def calculate_points(prediction, actual_results, multiplier=0.5, isTimingData=False):
    points = 0
    user_prediction = json.loads(prediction["prediction_json"])
    driver_column = "Abbreviation"
    if isTimingData: driver_column = "Driver"

    actual_positions = {
        driver: index + 1
        for index, driver in enumerate(actual_results[driver_column])
    }
    print(user_prediction)
    print(actual_positions)
    for index, driver in enumerate(user_prediction):
        if driver not in actual_positions:
            continue
        pos_difference = abs((index + 1) - actual_positions[driver])
        if pos_difference == 0:
            points += 5
        elif pos_difference == 1:
            points += 3
        elif pos_difference == 2:
            points += 2
        elif pos_difference == 3:
            points += 1

    points = math.floor(points * multiplier)

    print(f"Total points calculated for Season {prediction['season']}, Round {prediction['round_number']}, Session {prediction['session_type']}: {points}")

    return points

def score_session(season, round_number, session_type):
    db = get_db()

    try:
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
        actual_results.load()

        if actual_results is None:
            db.close()
            return None

        results_data = None
        if "Practice" in session_type:
            results_data = actual_results.laps.loc[lambda df: df["Deleted"] == False].dropna(subset=["LapTime"]).sort_values(by='LapTime').drop_duplicates(subset=['Driver'], keep="first").iloc[0:MAX_DRIVERS].reset_index(drop=True)
        else:
            results_data = actual_results.results.sort_values(by='Position').drop_duplicates(subset=['Abbreviation'], keep="first").iloc[0:MAX_DRIVERS].reset_index(drop=True)

        for prediction in predictions:
            if session_type == "Race":
                points = calculate_points(prediction, results_data, multiplier=2)
            elif session_type == "Sprint":
                points = calculate_points(prediction, results_data, multiplier=1.5)
            elif "Qualifying" in session_type:
                points = calculate_points(prediction, results_data, multiplier=1)
            else:
                points = calculate_points(prediction, results_data, multiplier=0.5, isTimingData=True)
            db.execute("""
                INSERT INTO points (prediction_id, value, updated_at) VALUES (?, ?, ?) ON CONFLICT (prediction_id) DO UPDATE SET value = EXCLUDED.value;
            """, (prediction["id"], points, datetime.now()))
            db.commit()
    finally:
        db.close()

    
