import { useState, useEffect } from 'react'
import { useAuth } from './components/AuthState'

export default function Header({ children}) {
  const { user } = useAuth()

  const handleLogoutRequest = () => {
    try {
        fetch("http://localhost:8000/api/logout", {
            method: "POST",
            credentials: "include"
        }).then(async response => {
            if (!response.ok) {
                const detail = await res.text();
                return alert(detail);
            }
        });
    } catch (err) {
      return alert("An error has occurred with login form request");
    }
  }

  return (
    <>
        <div className="header">
            <div className="header-left" style={{ marginRight: "auto" }}>
                <a href='/'>Home</a>
            </div>
            <a href='/dashboard'>Dashboard</a>
            <a href='/make-prediction'>Make Prediction</a>
            <a href='/leagues'>Leagues</a>
            <div className="header-right" style={{ marginLeft: "auto" }}>
                {user ? 
                <a onClick={() => handleLogoutRequest()}>Logout</a>
                : 
                <a href='/login'>Login</a>
                }
            </div>
        </div>

        {children}
    </>
  )
}
