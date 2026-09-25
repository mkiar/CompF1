import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthState";
export default function RaceCard({ league, needJoinBtn = false, needLeaveBtn = false, needDisbandBtn = false }) {
  const { user } = useAuth();

  const joinLeagueRequest = async (e, leagueId) => {
    try {
      const res = await fetch("http://localhost:8000/api/join-league", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          league_id: leagueId,
          join_code: e.target.value,
          user_id: user.id,
          user_username: user.username,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
      });
    } catch (err) {
      return alert("An error has occurred with join league request");
    }
  };

  const leaveLeagueRequest = async (e, leagueId) => {
    try {
      const res = await fetch("http://localhost:8000/api/leave-league", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          league_id: leagueId
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
      });
    } catch (err) {
      return alert("An error has occurred with leave league request");
    }
  };

  const disbandLeagueRequest = async (e, leagueId) => {
    try {
      const res = await fetch("http://localhost:8000/api/disband-league", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          league_id: leagueId
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
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
      <h3>
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
