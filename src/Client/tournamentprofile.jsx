import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import "./Styles/tournamentprofile.css"; // Import the CSS file

const TournamentProfile = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teamTournaments, setTeamTournaments] = useState([]);
  const [countryTournaments, setCountryTournaments] = useState([]);
  const [teams, setTeams] = useState({});
  const [countries, setCountries] = useState({});

  useEffect(() => {
    fetchTournament();
    fetchTeamTournaments();
    fetchCountryTournaments();
  }, [id]);

  const fetchTournament = async () => {
    try {
      const tournamentDoc = await fs.collection("tournaments").doc(id).get();
      if (tournamentDoc.exists) {
        setTournament({ id: tournamentDoc.id, ...tournamentDoc.data() });
      } else {
        console.error("Tournament not found");
      }
    } catch (error) {
      console.error("Error fetching tournament:", error.message);
    }
  };

  const fetchTeamTournaments = async () => {
    try {
      const snapshot = await fs.collection("teamTournaments").where("tournament", "==", id).get();
      const teamTournamentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const teamIds = teamTournamentData.map(teamTournament => teamTournament.team);
      const teamPromises = teamIds.map(async teamId => {
        const teamDoc = await fs.collection("teams").doc(teamId).get();
        return teamDoc.exists ? { id: teamId, name: teamDoc.data().teamName } : { id: teamId, name: "Unknown Team" };
      });

      const teamsData = await Promise.all(teamPromises);
      const teamsMap = teamsData.reduce((acc, team) => ({ ...acc, [team.id]: team.name }), {});

      setTeams(teamsMap);
      setTeamTournaments(teamTournamentData);
    } catch (error) {
      console.error("Error fetching team tournaments:", error.message);
    }
  };

  const fetchCountryTournaments = async () => {
    try {
      const snapshot = await fs.collection("countryTournaments").where("tournament", "==", id).get();
      const countryTournamentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const countryIds = countryTournamentData.map(countryTournament => countryTournament.country);
      const countryPromises = countryIds.map(async countryId => {
        const countryDoc = await fs.collection("countries").doc(countryId).get();
        return countryDoc.exists ? { id: countryId, name: countryDoc.data().name } : { id: countryId, name: "Unknown Country" };
      });

      const countriesData = await Promise.all(countryPromises);
      const countriesMap = countriesData.reduce((acc, country) => ({ ...acc, [country.id]: country.name }), {});

      setCountries(countriesMap);
      setCountryTournaments(countryTournamentData);
    } catch (error) {
      console.error("Error fetching country tournaments:", error.message);
    }
  };

  return (
    <div className="tournament-profile-container">
      {tournament ? (
        <>
          <h2>{tournament.name}</h2>
          <div className="team-tournaments">
            <h3>Team Tournaments</h3>
            <ul>
              {teamTournaments.map((teamTournament) => (
                <li key={teamTournament.id}>
                  <p>Team: {teams[teamTournament.team]}</p>
                  <p>Start Year: {teamTournament.startYear}</p>
                  <p>End Year: {teamTournament.endYear}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="country-tournaments">
            <h3>Country Tournaments</h3>
            <ul>
              {countryTournaments.map((countryTournament) => (
                <li key={countryTournament.id}>
                  <p>Country: {countries[countryTournament.country]}</p>
                  <p>Start Year: {countryTournament.startYear}</p>
                  <p>End Year: {countryTournament.endYear}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TournamentProfile;
