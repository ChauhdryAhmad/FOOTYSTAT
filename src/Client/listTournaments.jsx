import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth";
import { useNavigate } from "react-router-dom";
import './Styles/listtournament.css'; // Make sure to adjust the CSS file path

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const tournamentsRef = fs.collection("tournaments");
      const snapshot = await tournamentsRef.get();
      const tournamentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournaments(tournamentData);
    } catch (error) {
      console.error("Error fetching tournaments:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tournament-container">
      <h2>All Tournaments</h2>
      <div className="tournament-list">
        {tournaments.map((tournament) => {
          return (
            <div key={tournament.id} className="tournament-card">
              <h3>{tournament.name}</h3>
              <button
                className="view-details-button"
                onClick={() => navigate(`/tournament/${tournament.id}`)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentList;
