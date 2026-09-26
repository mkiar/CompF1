import { useState, useEffect } from "react";
import "./prediction.css";
import drivers from "../../drivers.json";

export default function Prediction() {
  const [eventData, setEventData] = useState(null);
  const [currentTab, setCurrentTab] = useState(null);
  const [predictions, setPredictions] = useState({ "s1": [], "s2": [], "s3": [], "s4": [], "s5": [] })
  const P1_DRIVER_CAP = 6
  const P2_DRIVER_CAP = 6
  const P3_DRIVER_CAP = 10
  const SPRINT_QUALI_DRIVER_CAP = 22
  const SPRINT_RACE_DRIVER_CAP = 22
  const QUALI_DRIVER_CAP = 22
  const RACE_DRIVER_CAP = 22

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

  if (!eventData) {
    return <p>Loading event data...</p>;
  }

  if (!currentTab) {
    setCurrentTab(eventData.s1);
  }

  const descriptionHandler = (sessionName) => {
    switch (sessionName) {
      case "Practice 1":
        return "Predict the Six Drivers Eliminated From Practice 1";
      case "Practice 2":
        return "Predict the Six Drivers Eliminated From Practice 2";
      case "Practice 3":
        return "Predict the Practice 3 P1-P10 order";
      case "Sprint Qualifying":
        return "Predict the P1-P22 Sprint Qualifying Order";
      case "Sprint":
        return "Predict the P1-P22 Sprint Order";
      case "Qualifying":
        return "Predict the P1-P22 Qualifying Order";
      case "Race":
        return "Predict the P1-P22 Race Order";
      default:
        return "No Session was Found";
    }
  };

  const predictionArrayHandler = (sessionName, driverCode) => {
    switch (sessionName) {
      case "Practice 1":
        if (predictions.s1.length === P1_DRIVER_CAP) {
          return alert(`You can't select more than ${P1_DRIVER_CAP} drivers`)
        }
        if (predictions.s1.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s1: [...predictions.s1, driverCode]}))
        break;
      case "Practice 2":
        if (predictions.s2.length === P2_DRIVER_CAP) {
          return alert(`You can't select more than ${P2_DRIVER_CAP} drivers`)
        }
        if (predictions.s2.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s2: [...predictions.s2, driverCode]}))
        break;
      case "Practice 3":
        if (predictions.s3.length === P3_DRIVER_CAP) {
          return alert(`You can't select more than ${P3_DRIVER_CAP} drivers`)
        }
        if (predictions.s3.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s3: [...predictions.s3, driverCode]}))
        break;
      case "Sprint Qualifying":
        if (predictions.s2.length === SPRINT_QUALI_DRIVER_CAP) {
          return alert(`You can't select more than ${SPRINT_QUALI_DRIVER_CAP} drivers`)
        }
        if (predictions.s2.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s2: [...predictions.s2, driverCode]}))
        break;
      case "Sprint":
        if (predictions.s3.length === SPRINT_RACE_DRIVER_CAP) {
          return alert(`You can't select more than ${SPRINT_RACE_DRIVER_CAP} drivers`)
        }
        if (predictions.s3.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s3: [...predictions.s3, driverCode]}))
        break;
      case "Qualifying":
        if (predictions.s4.length === QUALI_DRIVER_CAP) {
          return alert(`You can't select more than ${QUALI_DRIVER_CAP} drivers`)
        }
        if (predictions.s4.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s4: [...predictions.s4, driverCode]}))
        break;
      case "Race":
        if (predictions.s5.length === RACE_DRIVER_CAP) {
          return alert(`You can't select more than ${RACE_DRIVER_CAP} drivers`)
        }
        if (predictions.s5.indexOf(driverCode) !== -1) {
          return alert("You can't select a driver twice in one session")
        }
        setPredictions(oldArray => ({...oldArray, s5: [...predictions.s5, driverCode]}))
        break;
      default:
        break;
    }
  };

  const resetPredictions = (sessionName) => {
    switch (sessionName) {
      case "Practice 1":
        setPredictions(oldArray => ({...oldArray, s1: []} ))
        alert("Deleted Practice 1 Prediction Selections")
        break;
      case "Practice 2":
        setPredictions(oldArray => ({...oldArray, s2: []} ))
        alert("Deleted Practice 2 Prediction Selections")
        break;
      case "Practice 3":
        setPredictions(oldArray => ({...oldArray, s3: []} ))
        alert("Deleted Practice 3 Prediction Selections")
        break;
      case "Sprint Qualifying":
        setPredictions(oldArray => ({...oldArray, s2: []} ))
        alert("Deleted Sprint Qualifying Prediction Selections")
        break;
      case "Sprint":
        setPredictions(oldArray => ({...oldArray, s3: []} ))
        alert("Deleted Sprint Prediction Selections")
        break;
      case "Qualifying":
        setPredictions(oldArray => ({...oldArray, s4: []} ))
        alert("Deleted Qualifying Prediction Selections")
        break;
      case "Race":
        setPredictions(oldArray => ({...oldArray, s5: []} ))
        alert("Deleted Race Prediction Selections")
        break;
      default:
        break;
    }
  }

  const submitPredictions = async (e) => {
    e.preventDefault()
    let selectionArray = [];
    const sessionName = currentTab;

    if (sessionName === "Practice 1" && predictions.s1.length < P1_DRIVER_CAP) {
      return alert(`You must select ${P1_DRIVER_CAP} drivers`)
    } else if (sessionName === "Practice 2" && predictions.s2.length < P2_DRIVER_CAP) {
      return alert(`You must select ${P2_DRIVER_CAP} drivers`)
    } else if (sessionName === "Practice 3" && predictions.s3.length < P3_DRIVER_CAP) {
      return alert(`You must select ${P3_DRIVER_CAP} drivers`)
    } else if (sessionName === "Sprint Qualifying" && predictions.s2.length < SPRINT_QUALI_DRIVER_CAP) {
      return alert(`You must select ${SPRINT_QUALI_DRIVER_CAP} drivers`)
    } else if (sessionName === "Sprint" && predictions.s3.length < SPRINT_RACE_DRIVER_CAP) {
      return alert(`You must select ${SPRINT_RACE_DRIVER_CAP} drivers`)
    } else if (sessionName === "Qualifying" && predictions.s4.length < QUALI_DRIVER_CAP) {
      return alert(`You must select ${QUALI_DRIVER_CAP} drivers`)
    } else if (sessionName === "Race" && predictions.s5.length < RACE_DRIVER_CAP) {
      return alert(`You must select ${RACE_DRIVER_CAP} drivers`)
    }

    if (sessionName === "Practice 1" ) {
      selectionArray = predictions.s1
    } else if (sessionName === "Practice 2") {
      selectionArray = predictions.s2
    } else if (sessionName === "Practice 3") {
      selectionArray = predictions.s3
    } else if (sessionName === "Sprint Qualifying") {
      selectionArray = predictions.s2
    } else if (sessionName === "Sprint") {
      selectionArray = predictions.s3
    } else if (sessionName === "Qualifying") {
      selectionArray = predictions.s4
    } else if (sessionName === "Race") {
      selectionArray = predictions.s5
    }

    console.log(selectionArray)
    
    try {
      const res = await fetch("http://localhost:8000/api/make-prediction", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          round_num: eventData.round_num,
          session_type: sessionName,
          selections: selectionArray
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
      });
    } catch (err) {
      return alert(`An error has occurred with make prediction request`);
    }
  }

  return (
    <div className="prediction-container">
      <h1>Make Your Predictions</h1>
      <div className="tab-selection">
        {eventData ? (
          <>
            <button
              onClick={() => setCurrentTab(eventData.s1)}
              className="tab-selection-btn"
            >
              {eventData.s1}
            </button>
            <button
              onClick={() => setCurrentTab(eventData.s2)}
              className="tab-selection-btn"
            >
              {eventData.s2}
            </button>
            <button
              onClick={() => setCurrentTab(eventData.s3)}
              className="tab-selection-btn"
            >
              {eventData.s3}
            </button>
            <button
              onClick={() => setCurrentTab(eventData.s4)}
              className="tab-selection-btn"
            >
              {eventData.s4}
            </button>
            <button
              onClick={() => setCurrentTab(eventData.s5)}
              className="tab-selection-btn"
            >
              {eventData.s5}
            </button>
          </>
        ) : (
          <p>Loading event data...</p>
        )}
      </div>
      <div className="prediction-btns-section">
        <h3>{descriptionHandler(currentTab)}</h3>
        <h5>You can select the same driver across different sessions. To change your prediction, resubmit your selections under your preferred session.</h5>
        {Object.entries(drivers).map(([driver, code]) => {
          return (
            <button
              key={driver}
              className="prediction-btns"
              onClick={() => predictionArrayHandler(currentTab, code)}
            >
              {driver}
            </button>
          );
        })}
      </div>
      <div className="prediction-selections">
        {currentTab === "Practice 1" ? predictions.s1.map((driver, index) => {
          return (
          <h5>P{QUALI_DRIVER_CAP - P1_DRIVER_CAP + index + 1} {driver}</h5>
          )
        }) : <></>}
        {currentTab === "Practice 2" ? predictions.s2.map((driver, index) => {
          return (
          <h5>P{QUALI_DRIVER_CAP - P2_DRIVER_CAP - P1_DRIVER_CAP + index + 1} {driver}</h5>
          )
        }) : <></>}
        {currentTab === "Practice 3" ? predictions.s3.map((driver, index) => {
          return (
          <h5>P{index + 1} {driver}</h5>
          )
        }) : <></>}
        {currentTab === "Sprint Qualifying" ? predictions.s2.map((driver, index) => {
          return (
          <h5>P{index + 1} {driver}</h5>
          )
        }) : <></>}
        {currentTab === "Sprint" ? predictions.s3.map((driver, index) => {
          return (
          <h5>P{index + 1} {driver}</h5>
          )
        }) : <></>}
        {currentTab === "Qualifying" ? predictions.s4.map((driver, index) => {
          return (
          <h5>P{index + 1} {driver}</h5>
          )
        }) : <></>}
        {currentTab === "Race" ? predictions.s5.map((driver, index) => {
          return (
          <h5>P{index + 1} {driver}</h5>
          )
        }) : <></>}
      </div>
      <form className="prediction-form-submission" onReset={() => resetPredictions(currentTab)} onSubmit={submitPredictions}>
        <button type="submit" className="prediction-form-input">
          Submit
        </button>
        <button type="reset" className="prediction-form-input">
          Reset Selections
        </button>
      </form>
    </div>
  );
}
