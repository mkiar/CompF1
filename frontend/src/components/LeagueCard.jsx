import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthState";
export default function RaceCard({ league, needJoinBtn = false }) {
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
          className="join-league-card-btn"
          value={league.join_code}
          onClick={(e) => joinLeagueRequest(e, league.id)}
        >
          Join
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
