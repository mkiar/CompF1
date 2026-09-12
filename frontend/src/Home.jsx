import { useState, useEffect } from 'react'
import './home.css'
import RaceCard from './components/RaceCard.jsx'

export default function Home() {
  
  return (
    <div className="home-container">
      <RaceCard />
      <div className="web-info">
        <h1>Welcome to CompF1</h1>
        <p className="web-summary">Put your F1 knowledge to the test. Compete with friends by predicting race results, driver performances, and key moments throughout each Grand Prix weekend. Earn points for accurate predictions, climb your league leaderboard, and prove who really knows Formula 1.</p>
      </div>
    </div>
  )
}
