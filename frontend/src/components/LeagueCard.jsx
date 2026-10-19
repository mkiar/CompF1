import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthState";
export default function RaceCard({ league, needJoinBtn = false, needLeaveBtn = false, needDisbandBtn = false }) {
  const { user } = useAuth();

  const joinLeagueRequest = async (e, leagueId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leagues/${leagueId}/members`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          join_code: e.target.value,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const message = await response.json();
          return alert(message.detail);
        }
        window.location.reload();
      });
    } catch (err) {
      return alert("An error has occurred with join league request");
    }
  };

  const leaveLeagueRequest = async (e, leagueId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leagues/${leagueId}/members/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      }).then(async (response) => {
        if (!response.ok) {
          const message = await response.json();
          return alert(message.detail);
        }
        window.location.reload();
      });
    } catch (err) {
      return alert("An error has occurred with leave league request");
    }
  };

  const disbandLeagueRequest = async (e, leagueId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leagues/${leagueId}`, {
        method: "DELETE",
        credentials: "include"
      }).then(async (response) => {
        if (!response.ok) {
          const message = await response.json();
          return alert(message.detail);
        }
        window.location.reload();
      });
    } catch (err) {
      return alert("An error has occurred with disband league request");
    }
  };

  return (
    <div className="league-card">
      <h3 style={{ marginRight: "auto" }}>
        {league.name} created by {league.owner_username}
      </h3>
      <h3>Join Code: {league.join_code}</h3>
      <h3 style={{ marginLeft: "auto" }}>
        {league.member_count} / {league.member_limit} Members
      </h3>
      {needJoinBtn ? (
        <button
          className="league-card-btn"
          style={{ backgroundColor: "green" }}
          value={league.join_code}
          onClick={(e) => joinLeagueRequest(e, league.id)}
        >
          Join
        </button>
      ) : (
        <></>
      )}
      {needLeaveBtn ? (
        <button
          className="league-card-btn"
          style={{ backgroundColor: "yellow" }}
          onClick={(e) => leaveLeagueRequest(e, league.id)}
        >
          Leave
        </button>
      ) : (
        <></>
      )}
      {needDisbandBtn ? (
        <button
          className="league-card-btn"
          style={{ backgroundColor: "red" }}
          onClick={(e) => disbandLeagueRequest(e, league.id)}
        >
          Disband
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
