import { useState, useEffect } from 'react'
import './Signup.css'

export default function Signup() {
  
  return (
    <div className="signup-container">
      <form className='signup-form'>
        <h1>CompF1 Signup</h1>
        <input type='text' placeholder='Username' className='signup-inputs' minLength='3' maxLength='20'></input>
        <input type='email' placeholder='Email' className='signup-inputs'></input>
        <input type='password' placeholder='Password' className='signup-inputs'></input>
        <input type='password' placeholder='Confirm Password' className='signup-inputs'></input>
        <button type='submit' className='signup-inputs'>Create Account</button>
      </form>
    </div>
  )
}
