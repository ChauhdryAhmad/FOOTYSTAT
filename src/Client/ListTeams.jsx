import './Styles/listteam.css'; // Import the CSS file
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fs, auth } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
    fetchCountries();
    fetchLeagues();
  }, []);

  const fetchTeams = async () => {
    try {
      const teamsRef = fs.collection("teams");
      const snapshot = await teamsRef.get();
      const teamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamData);
    } catch (error) {
      console.error("Error fetching teams:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const countriesRef = fs.collection("countries");
      const snapshot = await countriesRef.get();
      const countryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCountries(countryData);
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    }
  };

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
    }
  };

  const handleLike = async (id, currentLikes) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await fs.collection("teams").doc(id).update({
          likes: currentLikes + 1,
        });
        // Store liked player with time
        await fs.collection("liked_teams").add({
          userId: user.uid,
          teamId: id,
          likedTime: new Date().toISOString(),
        });
        fetchTeams();
      } else {
        console.error("No user is currently logged in!");
      }
    } catch (error) {
      console.error("Error liking team:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="team-container">
      <h2>All Teams</h2>
      <div className="team-list">
        {teams.map((team) => {
          const country = countries.find((c) => c.id === team.countryId);
          const league = leagues.find((l) => l.id === team.leagueId); 
          return (
            <div key={team.id} className="team-card">
              <h3>{team.teamName}</h3>
              <p>Founded Date: {team.founded}</p>
              <p>President: {team.president}</p>
              <p>League: {league ? league.name : "Unknown"}</p>
              <p>Country: {country ? country.name : "Unknown"}</p>
              <p>Likes: {team.likes}</p>
              <button
                className="like-button"
                onClick={() => handleLike(team.id, team.likes)}
              >
                Like
              </button>
              <button
                className="view-profile-button"
                onClick={() => navigate(`/team/${team.id}`)}
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

export default TeamList;
