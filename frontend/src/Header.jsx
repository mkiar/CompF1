import { useState, useEffect } from 'react'

export default function Header({ children}) {

    const [loginState, setLoginState] = useState(false)
    // TODO: Create logout function to remove user session from browser and create a functioning login state
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
                {loginState ? 
                <a>Logout</a>
                : 
                <a href='/login'>Login</a>
                }
            </div>
        </div>

        {children}
    </>
  )
}
