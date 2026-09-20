import { useState, useEffect } from 'react'
import './leagues.css'
export default function Leagues() {
  const [currentTab, setCurrentTab] = useState(null);

  const getTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "create-league":
        return <>
        <form className="create-league-form">
          <h3>Create Your Own League</h3>
          <label>League Name: <input type="text" minLength="3" maxLength="20" placeholder="League Name"></input></label>
          <label>Visibility: <select><option>Public</option><option>Private</option></select></label>
          <label>League Members Limit: <input type="number" min="2" max="25"></input></label>
          <button type="submit" className="create-league-btns">Create League</button>
        </form>
        </>
      case "public-leagues":
        return <>
          
        </>
      case "my-leagues":
        return <>
          
        </>
      case "join-leagues":
        return <>
          <form className="join-league-form">
            <h3>Join a League</h3>
            <input type="text" minLength="8" maxLength="8" placeholder="Join Code"></input>
            <button type="submit" className="join-league-btns">Search</button>
          </form>
          <h4>Results</h4>
        </>
      default:
        return <p>Could not find that tab</p>
    }
  }

  if (!currentTab) {
    setCurrentTab("public-leagues")
  }

  return (
    <div className="leagues-container">
      <h1>Welcome to CompF1 Leagues</h1>
      <div className="tab-selection">
        <button onClick={() => setCurrentTab("create-league")} className="tab-btns">Create League</button>
        <button onClick={() => setCurrentTab("public-leagues")} className="tab-btns">View Public Leagues</button>
        <button onClick={() => setCurrentTab("my-leagues")} className="tab-btns">My Leagues</button>
        <button onClick={() => setCurrentTab("join-leagues")} className="tab-btns">Join League</button>
      </div>
      <div className="selected-tab-content">
        {getTabContent(currentTab)}
      </div>
    </div>
  )
}