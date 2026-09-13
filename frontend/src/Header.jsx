import { useState, useEffect } from 'react'

export default function Header({ children}) {
  
  return (
    <>
        <div className="header">
            <div className="header-left" style={{ marginRight: "auto" }}>
                <a href='/'>Home</a>
            </div>
            <a href='/leagues'>Leagues</a>
            <a href='/duels'>Duels</a>
            <div className="header-right" style={{ marginLeft: "auto" }}>
                <a href='/login'>Login</a>
            </div>
        </div>

        {children}
    </>
  )
}
