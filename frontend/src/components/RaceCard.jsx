import { useState, useEffect } from 'react'

export default function RaceCard() {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/current-event')
      .then(response => response.json())
      .then(data => {
        setEventData(data);
    }).catch(error => {
      console.error('Error fetching event data:', error);
    });
  }, []);

  const formatDateTime = (date) => {
    const current_date = new Date();
    const session_date = new Date(date)
    console.log("Current Date:", current_date.getHours());
    console.log("Session Date:", session_date.getHours());
    
    if (current_date > session_date) {
        return "Completed";
    } else {
        if (session_date.getDay() - current_date.getDay() > 0) {
            return `In ~${current_date.getDay() - session_date.getDay()} days`;
        } else if (current_date.getHours() - session_date.getHours() > 0) {
            return `In ~${current_date.getHours() - session_date.getHours()} hours`;
        } else if (current_date.getMinutes() - session_date.getMinutes() > 0) {
            return `In ${session_date.getMinutes() - current_date.getMinutes()} minutes`;
        } else if (current_date.getSeconds() - session_date.getSeconds() > 0) {
            return `In ${current_date.getSeconds() - session_date.getSeconds()} seconds`;
        } else {
            return "In Progress";
        }
        return session_date.getHours() + ":" + session_date.getMinutes() + ":" + session_date.getSeconds() + " UTC";
    }
  }

  if (!eventData) {
    return <p>Loading event data...</p>;
  }

  return (
    <div className="race-cards-container">
      {eventData ? (
        <>
            <div className="race-card">
                <p>Round {eventData.round_num} - {eventData.name} at {eventData.location}</p>
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
  )
}
