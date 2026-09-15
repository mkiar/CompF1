import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home.jsx'
import Header from './Header.jsx'
import Dashboard from './Dashboard.jsx'
import Leagues from './Leagues.jsx'
import Login from './Login.jsx'

export default function App() {

  return (
    <Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Header>
  )
}
