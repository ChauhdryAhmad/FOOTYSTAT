import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth";
import { useNavigate } from "react-router-dom";
import './Styles/listleague.css';


const LeagueList = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const leaguesRef = fs.collection("leagues");
      const snapshot = await leaguesRef.get();
      const leagueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeagues(leagueData);
    } catch (error) {
      console.error("Error fetching leagues:", error.message);
    } finally {
        setLoading(false);
      }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="league-container">
      <h2>All Leagues</h2>
      <div className="league-list">
        {leagues.map((league) => {
          return (
            <div key={league.id} className="league-card">
              <h3>{league.name}</h3>
              <button
                className="view-profile-button"
                onClick={() => navigate(`/league/${league.id}`)}
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeagueList;
