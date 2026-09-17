import { useState, useEffect } from 'react'
import './login.css'

export default function Login() {
  
  return (
    <div className="login-container">
      <form className='login-form'>
        <h1>CompF1 Login</h1>
        <input type='text' placeholder='Username' id='username' minLength="3" maxLength="12" className='login-inputs'></input>
        <input type='password' placeholder='Password' id='password' className='login-inputs'></input>
        <button type='submit' className='login-inputs'>Login</button>
        <a href='/signup'>Create an account!</a>
        <a>Forgot your password?</a>
      </form>
    </div>
  )
}
