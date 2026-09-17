import { useState, useEffect } from 'react'

export default function Prediction() {
  
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/current-event')
      .then(response => response.json())
      .then(data => {
        setEventData(data);
    }).catch(error => {
      alert("There was an error fetching the current event data. Please try again later.");
    });
  }, []);

  if (!eventData) {
    return <p>Loading event data...</p>
  }

  return (
    <div className="prediction-container">
      {eventData ? 
      <>
        <label for={eventData.s1}>{eventData.s1} Eliminations</label>
        <select id={eventData.s1} name={eventData.s1}>
          <option></option>
        </select>
        <select id={eventData.s1} name={eventData.s1}>
          <option></option>
        </select>
        <select id={eventData.s1} name={eventData.s1}>
          <option></option>
        </select>
        <select id={eventData.s1} name={eventData.s1}>
          <option></option>
        </select>
        <select id={eventData.s1} name={eventData.s1}>
          <option></option>
        </select>
        <select id={eventData.s1} name={eventData.s1}>
          <option></option>
        </select>
      </>
      : 
      <p>Loading event data...</p>
      }
    </div>
  )
}