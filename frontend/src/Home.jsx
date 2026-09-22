import { useState, useEffect } from 'react'
import './home.css'
import RaceCard from './components/RaceCard.jsx'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './components/AuthState.jsx'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <div className="home-container">
      <RaceCard />
      <div className="web-info">
        <h1>Welcome to CompF1</h1>
        <p className="web-summary">Put your F1 knowledge to the test. Compete with friends by predicting race results, driver performances, and key moments throughout each Grand Prix weekend. Earn points for accurate predictions, climb your league leaderboard, and prove who really knows Formula 1.</p>
      </div>
      {user ? 
        <button type="button" className="get-started-btn" onClick={() => navigate("/dashboard")}>Go to Dashboard</button> 
        : 
        <button type="button" className="get-started-btn" onClick={() => navigate("/login")}>Get Started</button>
      }
      <div className="onboarding-info">
          <div className="onboarding-step">
            <h3>1. Create an Account</h3>
            <p>Sign up for a free account to start making predictions and competing with friends.</p>
          </div>
          <div className="onboarding-step">
            <h3>2. Make Predictions</h3>
            <p>Before each race session, make your predictions on race results, driver performances, and key moments.</p>
          </div>
          <div className="onboarding-step">
            <h3>3. Earn Points and Climb the Leaderboard</h3>
            <p>Earn points for accurate predictions and climb the global leaderboard.</p>
          </div>
          <div className="onboarding-step">
            <h3>4. Join or Create a League</h3>
            <p>Join an existing league or create your own to compete with friends and other F1 fans.</p>
          </div>
      </div>
    </div>
  )
}
