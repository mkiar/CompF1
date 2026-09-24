import { useState, useEffect } from "react";

export default function RaceCard() {
  const [eventData, setEventData] = useState(null);

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
  }, []);

  const formatDateTime = (date) => {
    const current_date = new Date();
    const session_date = new Date(date);
    const differenceInMs = session_date.getTime() - current_date.getTime();
    const differenceInDays = Math.floor(differenceInMs / 86400000);
    const differenceInHours = Math.floor(differenceInMs / 3600000);
    const differenceInMinutes = Math.floor(differenceInMs / 60000);
    const differenceInSeconds = Math.floor(differenceInMs / 1000);

    if (current_date > session_date) {
      return "Completed";
    } else {
      if (differenceInDays > 0) {
        return `In ${differenceInDays} day(s)`;
      } else if (differenceInHours > 0) {
        return `In ${differenceInHours} hour(s)`;
      } else if (differenceInMinutes > 0) {
        return `In ${differenceInMinutes} minute(s)`;
      } else if (differenceInSeconds > 0) {
        return `In ${differenceInSeconds} second(s)`;
      } else {
        return "In Progress";
      }
    }
  };

  if (!eventData) {
    return <p>Loading event data...</p>;
  }

  return (
    <div className="race-cards-container">
      {eventData ? (
        <>
          <div className="race-card">
            <p>
              Round {eventData.round_num} - {eventData.name} at{" "}
              {eventData.location}
            </p>
          </div>
          <div className="race-card">
            <p>{eventData.s1}</p>
            <p>{formatDateTime(eventData.s1_date)}</p>
          </div>
          <div className="race-card">
            <p>{eventData.s2}</p>
            <p>{formatDateTime(eventData.s2_date)}</p>
          </div>
          <div className="race-card">
            <p>{eventData.s3}</p>
            <p>{formatDateTime(eventData.s3_date)}</p>
          </div>
          <div className="race-card">
            <p>{eventData.s4}</p>
            <p>{formatDateTime(eventData.s4_date)}</p>
          </div>
          <div className="race-card">
            <p>{eventData.s5}</p>
            <p>{formatDateTime(eventData.s5_date)}</p>
          </div>
        </>
      ) : (
        <p>Loading event data...</p>
      )}
    </div>
  );
}
