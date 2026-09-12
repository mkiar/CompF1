import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Home.jsx'
import Header from './Header.jsx'

export default function App() {

  return (
    <Header>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Header>
  )
}
