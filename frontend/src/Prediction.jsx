import { useState, useEffect } from 'react'
import './prediction.css'
import drivers from '../../drivers.json'

export default function Prediction() {
  
  const [eventData, setEventData] = useState(null);
  const [currentTab, setCurrentTab] = useState(null);
  const [sessionOneElims, setSessionOneElims] = useState(null)

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

  if (!currentTab) {
    setCurrentTab(eventData.s1);
  }

  const descriptionHandler = (sessionName) => {
    console.log(sessionName)
    switch (sessionName) {
      case "Practice 1":
        return "Predict The Six Drivers Eliminated From Practice 1"
      case "Practice 2":
        return "Predict The Six Drivers Eliminated From Practice 2"
      case "Practice 3": 
        return "Predict The Practice 3 P1-P10 order"
      case "Sprint Qualifying":
        return "Predict The P1-P22 Sprint Qualifying Order"
      case "Sprint":
        return "Predict The P1-P22 Sprint Order"
      case "Qualifying":
        return "Predict The P1-P22 Qualifying Order"
      case "Race":
        return "Predict The P1-P22 Race Order"
      default:
        return "No Session was Found"
    }
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
      <h3>{descriptionHandler(currentTab)}</h3>
      <div className="prediction-btns-section">
        {Object.entries(drivers).map(([driver, code]) => {
          return <button key={driver} className="prediction-btns">{driver}</button>
        })}
      </div>
      <form className="prediction-form-submission">
        <button type="submit" className="prediction-form-input">Submit</button>
        <button type="reset" className="prediction-form-input">Reset Selections</button>
      </form>
    </div>
  )
}