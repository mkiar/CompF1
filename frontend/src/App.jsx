import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home.jsx'
import Header from './Header.jsx'
import Dashboard from './Dashboard.jsx'
import Leagues from './Leagues.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Prediction from './Prediction'
import { useAuth } from './components/AuthState.jsx'

export default function App() {
  const { user } = useAuth();

  return (
    <Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Dashboard/> : <Login />} />
        <Route path="/signup" element={user ? <Dashboard/> : <Signup />} />
        <Route path="/leagues" element={user ? <Leagues /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
        <Route path="/make-prediction" element={user ? <Prediction /> : <Login />} />
      </Routes>
    </Header>
  )
}
