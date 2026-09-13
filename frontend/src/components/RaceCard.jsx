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
    const differenceInMs = session_date.getTime() - current_date.getTime();
    const differenceInDays = Math.floor(differenceInMs / 86400000);
    const differenceInHours = Math.floor(differenceInMs / 3600000);
    const differenceInMinutes = Math.floor(differenceInMs / 60000);
    const differenceInSeconds = Math.floor(differenceInMs / 1000);
    console.log('Difference in date:', differenceInDays, 'days,', differenceInHours, 'hours,', differenceInMinutes, 'minutes,', differenceInSeconds, 'seconds');
    
    if (current_date > session_date) {
        return "Completed";
    } else {
        if (differenceInDays > 0) {
            return `In ${differenceInDays} days`;
        } else if (differenceInHours > 0) {
            return `In ${differenceInHours} hours`;
        } else if (differenceInMinutes > 0) {
            return `In ${differenceInMinutes} minutes`;
        } else if (differenceInSeconds > 0) {
            return `In ${differenceInSeconds} seconds`;
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
