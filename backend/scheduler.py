from apscheduler.schedulers.background import BackgroundScheduler
from scoring import check_and_score_sessions

scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_job(
        check_and_score_sessions,
        "interval",
        minutes=30
    )

    scheduler.start()