import { useState, useEffect } from "react";
import "./dashboard.css";
import { useAuth } from "./components/AuthState";

export default function Dashboard() {
  const [eventData, setEventData] = useState(null);
  const [predictionData, setPredictionData] = useState([])
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8000/api/current-event")
      .then((response) => response.json())
      .then((data) => {
        setEventData(data);
      })
      .catch((error) => {
        alert(
          "There was an error fetching the current event data. Please try again later.",
        );
      });
      fetch("http://localhost:8000/api/check-predictions", {
        credentials: "include"
      })
      .then((response) => response.json())
      .then((data) => {
        setPredictionData(data);
      })
      .catch((error) => {
        alert(
          "There was an error fetching the prediction data. Please try again later.",
        );
      });
  }, []);

  if (!eventData) {
    return <p>Loading event data...</p>;
  }

  const formatPredictionClosureTime = (date) => {
    const current_date = new Date();
    const session_date = new Date(date);
    const differenceInMs = session_date.getTime() - current_date.getTime();
    const differenceInDays = Math.floor(differenceInMs / 86400000);
    const differenceInHours = Math.floor(differenceInMs / 3600000);
    const differenceInMinutes = Math.floor(differenceInMs / 60000);
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    if (current_date > session_date) {
      return "Prediction submission is closed";
    } else {
      if (differenceInDays > 0) {
        return `Prediction submission closes in ${differenceInDays} day(s)`;
      } else if (differenceInHours > 0) {
        return `Prediction submission closes in ${differenceInHours} hour(s)`;
      } else if (differenceInMinutes > 0) {
        return `Prediction submission closes in ${differenceInMinutes} minute(s)`;
      } else if (differenceInSeconds > 0) {
        return `Prediction submission closes in ${differenceInSeconds} second(s)`;
      } else {
        return "Prediction submission closes now";
      }
    }
  };

  let s1PredictionCheck;
  let s2PredictionCheck;
  let s3PredictionCheck;
  let s4PredictionCheck;
  let s5PredictionCheck;

  if (predictionData.predictions) {
    s1PredictionCheck = predictionData.predictions.find(e => e.session_type === "Practice 1")
    s2PredictionCheck = predictionData.predictions.find(e => e.session_type === "Practice 2" || e.session_type === "Sprint Qualifying")
    s3PredictionCheck = predictionData.predictions.find(e => e.session_type === "Practice 3" || e.session_type === "Sprint")
    s4PredictionCheck = predictionData.predictions.find(e => e.session_type === "Qualifying")
    s5PredictionCheck = predictionData.predictions.find(e => e.session_type === "Race")
  }

  return (
    <div className="dashboard-container">
      <div className="points-history">
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
      </div>
      <div className="middle-container">
        <h1>Hello {user.username}!</h1>
        <div className="prediction-summary">
          {eventData ? (
            <>
              <h3>{eventData.name}</h3>
              <h4>{formatPredictionClosureTime(eventData.s1_date)}</h4>
              <div className="prediction-submission-check">
                <h4>{eventData.s1} - {s1PredictionCheck ? "Submitted" : "Not Submitted"}</h4>
                <h4>{eventData.s2} - {s2PredictionCheck ? "Submitted" : "Not Submitted"}</h4>
                <h4>{eventData.s3} - {s3PredictionCheck ? "Submitted" : "Not Submitted"}</h4>
                <h4>{eventData.s4} - {s4PredictionCheck ? "Submitted" : "Not Submitted"}</h4>
                <h4>{eventData.s5} - {s5PredictionCheck ? "Submitted" : "Not Submitted"}</h4>
              </div>
            </>
          ) : (
            <>
              <h3>Loading event data...</h3>
            </>
          )}
        </div>
        <h3>Season Summary</h3>
        <div className="season-summary">
          <h4>Total Points - Points Placeholder</h4>
          <h4>Races Predicted - Race Amount Placeholder</h4>
        </div>
      </div>
      <div className="points-history">
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
        <h4>Placeholder Race History</h4>
      </div>
    </div>
  );
}
