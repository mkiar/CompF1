import { useState, useEffect } from "react";
import { useAuth } from "./components/AuthState";
import './settings.css';

export default function Settings() {
  const { user, setUser } = useAuth();

  const handleLogoutRequest = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await res.text();
          return alert(detail);
        }
      });
      setUser(null);
    } catch (err) {
      return alert("An error has occurred with logout form request");
    }
  };

  const deleteAccountRequest = async () => {
    
  }

  return (
    <>
      <div className="settings-container">
        <h1>Settings</h1>
        <div className="settings-content">
          <div className="profile-section">
            <h2>Profile</h2>
            <label>Username: {user?.username}</label>
            <label>Email: {user?.email}</label>
            <button onClick={handleLogoutRequest} style={{ backgroundColor: "red"}}>Logout</button>
          </div>
          <div className="account-section">
            <h2>Account Settings</h2>
            <form className="change-form">
                <input type="text" placeholder="New Username" />
                <button type="submit">Update Username</button>
            </form>
            <form className="change-form">
                <input type="text" placeholder="New Email" />
                <button type="submit">Update Email</button>
            </form>
            <form className="change-form">
                <input type="password" placeholder="Old Password" />
                <input type="password" placeholder="New Password" />
                <input type="password" placeholder="Confirm Password" />
                <button type="submit">Update Password</button>
            </form>
            <button onClick={deleteAccountRequest} style={{ backgroundColor: "red"}}>Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
}
