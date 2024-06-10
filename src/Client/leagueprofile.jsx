import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Styles/leagueprofile.css'; // Import the CSS file

const LeagueProfile = () => {
  const { id } = useParams();
  const [league, setLeague] = useState(null);
  const [teamLeagues, setTeamLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingLeague, setLoadingLeague] = useState(true);
  const [loadingTeamLeagues, setLoadingTeamLeagues] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    fetchLeagueData();
    fetchTeamLeagues();
    fetchTeams();
  }, [id]);

  const fetchLeagueData = async () => {
    try {
      const leagueRef = fs.collection("leagues").doc(id);
      const doc = await leagueRef.get();
      if (doc.exists) {
        console.log("League data:", doc.data());
        setLeague(doc.data());
      } else {
        console.log("No such document for league!");
      }
    } catch (error) {
      console.error("Error fetching league data:", error.message);
    } finally {
      setLoadingLeague(false);
    }
  };

  const fetchTeamLeagues = async () => {
    try {
      const teamLeaguesRef = fs.collection("teamLeagues").where("leagueId", "==", id);
      const snapshot = await teamLeaguesRef.get();
      if (snapshot.empty) {
        console.log("No team leagues found for this league.");
      }
      const teamLeagueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Team leagues data:", teamLeagueData);
      setTeamLeagues(teamLeagueData);
    } catch (error) {
      console.error("Error fetching team leagues:", error.message);
    } finally {
      setLoadingTeamLeagues(false);
    }
  };

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
      setLoadingTeams(false);
    }
  };

  if (loadingLeague || loadingTeamLeagues || loadingTeams) {
    return <div>Loading...</div>;
  }

  if (!league) {
    return <div>No league data available</div>;
  }

  return (
    <div className="leagueprofile-container">
      <h2>{league.name} Profile</h2>
      <p>Founded Date: {league.foundedDate}</p>

      <h3>Teams in {league.name}</h3>
      <ul>
        {teamLeagues.length > 0 ? (
          teamLeagues.map((teamLeague, index) => {
            const team = teams.find((team) => team.id === teamLeague.teamId);
            return (
              <li key={index}>
                <p>Team: {team ? team.teamName : "Unknown"}</p>
                <p>Year: {teamLeague.startYear} - {teamLeague.endYear || "Present"}</p>
              </li>
            );
          })
        ) : (
          <p>No teams currently in this league</p>
        )}
      </ul>
    </div>
  );
};

export default LeagueProfile;
