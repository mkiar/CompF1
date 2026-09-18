import { useState, useEffect } from 'react'
import './prediction.css'
export default function Prediction() {
  
  const [eventData, setEventData] = useState(null);
  const [currentTab, setCurrentTab] = useState(null);
  const drivers = {
    "Max Verstappen": "VER",
    "Isack Hadjar": "HAD",
    "Liam Lawson": "LAW",
    "Arvid Lindblad": "LIN",
    "Charles Leclerc": "LEC",
    "Lewis Hamilton": "HAM",
    "Lando Norris": "NOR",
    "Oscar Piastri": "PIA",
    "George Russell": "RUS",
    "Kimi Antonelli": "ANT",
    "Pierre Gasly": "GAS",
    "Franco Colapinto": "COL",
    "Esteban Ocon": "OCO",
    "Oliver Bearman": "BEA",
    "Nico Hülkenberg": "HUL",
    "Gabriel Bortoleto": "BOR",
    "Fernando Alonso": "ALO",
    "Lance Stroll": "STR",
    "Alexander Albon": "ALB",
    "Carlos Sainz": "SAI",
    "Sergio Pérez": "PER",
    "Valterri Bottas": "BOT"
  }

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
      <h1>Make Your Predictions</h1>
      <div className="tab-selection">
        {eventData ? 
        <>
          <button onClick={() => setCurrentTab(eventData.s1)} className="tab-selection-btn">{eventData.s1}</button>
          <button onClick={() => setCurrentTab(eventData.s2)} className="tab-selection-btn">{eventData.s2}</button>
          <button onClick={() => setCurrentTab(eventData.s3)} className="tab-selection-btn">{eventData.s3}</button>
          <button onClick={() => setCurrentTab(eventData.s4)} className="tab-selection-btn">{eventData.s4}</button>
          <button onClick={() => setCurrentTab(eventData.s5)} className="tab-selection-btn">{eventData.s5}</button>
        </>
        : 
        <p>Loading event data...</p>
        }
      </div>
      <div className="prediction-btns">
        {Object.entries(drivers).forEach((key, value) => {
          <button>{key[0]}</button>
        })}
      </div>
    </div>
  )
}