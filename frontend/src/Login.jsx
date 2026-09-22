import { useState, useEffect } from "react";
import "./login.css";
import { useAuth } from "./components/AuthState";

export default function Login() {
  const { setUser } = useAuth()

  const handleLoginRequest = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      }).then(async response => {
        if (!response.ok) {
          const detail = await res.text();
          return alert(detail);
        }
        const data = await response.json()
        setUser(data.user)
      });
    } catch (err) {
      return alert("An error has occurred with login form request");
    }
  };

  return (
    <div className="login-container" onSubmit={handleLoginRequest}>
      <form className="login-form">
        <h1>CompF1 Login</h1>
        <input
          type="text"
          placeholder="Username"
          id="username"
          minLength="3"
          maxLength="20"
          className="login-inputs"
          name="username"
        ></input>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="login-inputs"
          minLength="8"
          maxLength="64"
          name="password"
        ></input>
        <button type="submit" className="login-inputs">
          Login
        </button>
        <a href="/signup">Create an account!</a>
        <a>Forgot your password?</a>
      </form>
    </div>
  );
}
