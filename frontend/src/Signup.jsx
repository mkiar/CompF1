import { useState, useEffect } from 'react'
import './Signup.css'

export default function Signup() {

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const signupFormSubmission = async (e) => {
        e.preventDefault()
        const password = e.target.password.value
        const confirmedPassword = e.target.confirm_password.value
        if (password !== confirmedPassword) {
            return alert("Password and Confirm Password do not match!")
        }
        try {
            const res = await fetch("http://localhost:8000/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    email: e.target.email.value,
                    password: e.target.password.value,
                    confirm_password: e.target.confirm_password.value
                })
            })
            if (!res.ok) {
                const detail = await res.text()
                return alert(detail)
            }
        } catch (err) {
            return alert("An error has occurred with signup form request")
        }
    }
  
  return (
    <div className="signup-container">
      <form className='signup-form' onSubmit={signupFormSubmission}>
        <h1>CompF1 Signup</h1>
        <input type='text' placeholder='Username' className='signup-inputs' minLength='3' maxLength='20' name="username" required></input>
        <input type='email' placeholder='Email' className='signup-inputs' name="email" required></input>
        <input type='password' placeholder='Password' className='signup-inputs' name="password" onChange={(e) => setPassword(e.target.value)} required></input>
        <input type='password' placeholder='Confirm Password' className='signup-inputs' minLength="8" maxLength="64" name="confirm_password" onChange={(e) => setConfirmPassword(e.target.value)} required></input>
        <button type='submit' className='signup-inputs'>Create Account</button>
      </form>
    </div>
  )
}
