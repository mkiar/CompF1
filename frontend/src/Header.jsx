import { useState, useEffect } from 'react'

export default function Header({ children}) {
  
  return (
    <>
        <div className="header">
        <a href='/'>Home</a>
        <a href='/leagues'>Leagues</a>
        <a href='/login'>Login</a>
        </div>

        {children}
    </>
  )
}
