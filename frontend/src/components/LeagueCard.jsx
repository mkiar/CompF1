import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthState";
export default function LeagueCard({ league, needJoinBtn = false, needLeaveBtn = false, needDisbandBtn = false, owner = false }) {
  const { user } = useAuth();
  const [leagueMembers, setLeagueMembers] = useState(null)

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
      const res = await fetch(`http://localhost:8000/api/leagues/${leagueId}/members/me`, {
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

  const getLeagueMembers = async (e, leagueId) => {
    if (leagueMembers) {
      setLeagueMembers(null)
    } else {
      try {
        const res = await fetch(`http://localhost:8000/api/leagues/${leagueId}/leaderboard`, {
          method: "GET",
          credentials: "include"
        }).then(async (response) => {
          if (!response.ok) {
            const message = await response.json();
            return alert(message.detail);
          }
          const data = await response.json()
          setLeagueMembers(data.leaderboard)
        })
      } catch (err) {
        return alert("An error has occurred with get league members request");
      }
    }
  }

  const kickMember = async (e, leagueId, userId) => {
    try {
        const res = await fetch(`http://localhost:8000/api/leagues/${leagueId}/members/${userId}`, {
          method: "DELETE",
          credentials: "include"
        }).then(async (response) => {
          if (!response.ok) {
            const message = await response.json();
            return alert(message.detail);
          }
          window.location.reload();
        })
      } catch (err) {
        return alert("An error has occurred with kick member request");
      }
  }

  return (
    <div className="league-card">
      <button className="league-btn" onClick={(e) => getLeagueMembers(e, league.id)}>
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
      </button>
      <div className="league-settings">
        {owner && leagueMembers ? 
        <> 
          <form className="league-settings-form">
            <h3 style={{ marginRight: "auto" }}>League Settings</h3>
            <label>
                Change League Name:{" "}
                <input
                  type="text"
                  minLength="3"
                  maxLength="20"
                  placeholder="League Name"
                  name="league_name"
                ></input>
              </label>
            <label>Visibility: <select><option>Public</option><option>Private</option></select></label>
            <label>
                League Members Limit:{" "}
                <input
                  type="number"
                  min={league.member_count}
                  max="25"
                  name="league_mems_limit"
                  placeholder="25"
                ></input>
              </label>
              <button type="submit" style={{ marginLeft: "auto", backgroundColor: "green" }} className="league-card-btn">Save</button>
          </form>
        </>
        : 
        <></>}
      </div>
      <div className="league-leaderboard">
        {leagueMembers ? (Object.values(leagueMembers).map((member, index) => {
          return (
          <>
          <div className="league-member">
            <p style={{ marginRight: "auto" }}>{index + 1}.</p>
            <p>{member.username}</p>
            <p style={{ marginLeft: "auto"}}>{member.total_points} Points</p>
            {owner && member.id != user.id ? 
              <button
                className="league-card-btn"
                style={{ backgroundColor: "red" }}
                onClick={(e) => kickMember(e, league.id, member.id)}
              >
              Kick
              </button> : <></>}
          </div>
          </>
          )
        })) : <></>}
      </div>
    </div>
  );
}
