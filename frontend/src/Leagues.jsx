import { useState, useEffect } from "react";
import "./leagues.css";
import { useAuth } from "./components/AuthState";
import LeagueCard from "./components/LeagueCard";

export default function Leagues() {
  const [currentTab, setCurrentTab] = useState(null);
  const [leaguesList, setLeaguesList] = useState(null);
  const [myLeaguesList, setMyLeaguesList] = useState(null);
  const [searchLeague, setSearchLeague] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8000/api/leagues")
      .then((response) => response.json())
      .then((data) => {
        setLeaguesList(data.leagues);
      })
      .catch((error) => {
        alert(
          "There was an error fetching the public leagues. Please try again later.",
        );
      });
  }, []);

  const createLeagueRequest = async (e) => {
    e.preventDefault();
    const league_name = e.target.league_name.value;
    const league_visibility = e.target.league_visibility.value;
    const league_mems_limit = e.target.league_mems_limit.value;

    try {
      const res = await fetch("http://localhost:8000/api/create-league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: league_name,
          owner_id: user.id,
          owner_username: user.username,
          public: `${league_visibility === "Public" ? true : false}`,
          member_limit: league_mems_limit,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
      });
    } catch (err) {
      return alert("An error has occurred with create league request");
    }
  };

  const myLeagueRequest = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/my-leagues", {
        method: "GET",
        credentials: "include",
      }).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
        const data = await response.json();
        setMyLeaguesList(data.leagues);
      });
    } catch (err) {
      return alert("An error has occurred with my league request");
    }
  };

  const searchLeagueRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/search-league?join_code=${e.target.join_code.value}`,
        {
          method: "GET",
        },
      ).then(async (response) => {
        if (!response.ok) {
          const detail = await response.text();
          return alert(detail);
        }
        const data = await response.json();
        setSearchLeague(data.league);
      });
    } catch (err) {
      return alert("An error has occurred with search league request");
    }
  };

  const getTabContent = (selectedTab) => {
    switch (selectedTab) {
      case "create-league":
        return (
          <>
            <form className="create-league-form" onSubmit={createLeagueRequest}>
              <h3>Create Your Own League</h3>
              <label>
                League Name:{" "}
                <input
                  type="text"
                  minLength="3"
                  maxLength="20"
                  placeholder="League Name"
                  name="league_name"
                  required
                ></input>
              </label>
              <label>
                Visibility:{" "}
                <select name="league_visibility" required>
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </label>
              <label>
                League Members Limit:{" "}
                <input
                  type="number"
                  min="2"
                  max="25"
                  name="league_mems_limit"
                  placeholder="25"
                  required
                ></input>
              </label>
              <button type="submit" className="create-league-btns">
                Create League
              </button>
            </form>
          </>
        );
      case "public-leagues":
        return (
          <>
            {leaguesList ? (
              Object.values(leaguesList).map((league) => {
                return (
                  <LeagueCard
                    league={league}
                    key={league.id}
                    needJoinBtn={true}
                  />
                );
              })
            ) : (
              <p>Loading Public Leagues...</p>
            )}
          </>
        );
      case "my-leagues":
        return (
          <>
            {myLeaguesList ? (
              Object.values(myLeaguesList).map((league) => {
                return <LeagueCard league={league} key={league.id} />;
              })
            ) : (
              <p>Loading Your Leagues...</p>
            )}
          </>
        );
      case "join-leagues":
        return (
          <>
            <form className="join-league-form" onSubmit={searchLeagueRequest}>
              <h3>Join a League</h3>
              <input
                type="text"
                minLength="8"
                maxLength="8"
                placeholder="Join Code"
                name="join_code"
                required
              ></input>
              <button type="submit" className="search-league-btns">
                Search
              </button>
            </form>
            {searchLeague ? (
              <>
                {" "}
                <h3>Search Result</h3>{" "}
                <LeagueCard league={searchLeague} needJoinBtn={true} />{" "}
              </>
            ) : (
              <></>
            )}
          </>
        );
      default:
        return <p>Could not find that tab</p>;
    }
  };

  if (!currentTab) {
    setCurrentTab("public-leagues");
  }

  return (
    <div className="leagues-container">
      <h1>Welcome to CompF1 Leagues</h1>
      <div className="tab-selection">
        <button
          onClick={() => setCurrentTab("create-league")}
          className="tab-btns"
        >
          Create League
        </button>
        <button
          onClick={() => setCurrentTab("public-leagues")}
          className="tab-btns"
        >
          View Public Leagues
        </button>
        <button
          onClick={() => [setCurrentTab("my-leagues"), myLeagueRequest()]}
          className="tab-btns"
        >
          My Leagues
        </button>
        <button
          onClick={() => setCurrentTab("join-leagues")}
          className="tab-btns"
        >
          Join League
        </button>
      </div>
      <div className="selected-tab-content">{getTabContent(currentTab)}</div>
    </div>
  );
}
