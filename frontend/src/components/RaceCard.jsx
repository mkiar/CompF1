import { useState, useEffect } from 'react'

export default function RaceCard() {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/current-event')
      .then(response => response.json())
      .then(data => {
        setEventData(data);
        console.log(data)
    }).catch(error => {
      console.error('Error fetching event data:', error);
    });
  }, []);

  if (!eventData) {
    return <p>Loading event data...</p>;
  }

  return (
    <div className="race-card-container">
      {eventData ? (
        <div className="race-card">
            <p>Round Number: {eventData.round_num}</p>
            <p>Session Location: {eventData.location}</p> 
            <p>Event Name: {eventData.name}</p>
            <p>Session Format: {eventData.format}</p>
            <p>Session Date: {eventData.date}</p>
        </div>
      ) : (
        <p>Loading event data...</p>
      )}
    </div>
  )
}
