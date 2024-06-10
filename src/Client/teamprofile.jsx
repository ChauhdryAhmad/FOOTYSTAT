import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Styles/teamprofile.css'; // Import the CSS file

const TeamProfile = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [leagueWins, setLeagueWins] = useState([]);
  const [tournaments, setTournament] = useState([]);
  const [stadiums, setStadium] = useState([]);
  const [currentManager, setCurrentManager] = useState([]);
  const [previousManager, setPreviousManager] = useState([]);
  const [sponsors, setSponsor] = useState([]);



  useEffect(() => {
    fetchTeamData();
    fetchCountries();
    fetchLeagues();
    fetchLeagueWins();
    fetchTournaments();
    fetchStadiums();
    fetchManager();
    fetchSponsors();
  }, [id]);

  const fetchTeamData = async () => {
    try {
      const teamRef = fs.collection("teams").doc(id);
      const doc = await teamRef.get();
      if (doc.exists) {
        setTeam(doc.data());
      }
    } catch (error) {
      console.error("Error fetching team data:", error.message);
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

  const fetchManager = async () => {
    try {
      const managerTeamsRef = fs.collection("teamManagers").where("team", "==", id);
      const snapshot = await managerTeamsRef.get();
      const managersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      // Find current manager
      const currentManagerDoc = managersData.find((manager) => !manager.endDate || new Date(manager.endDate) > new Date());
      if (currentManagerDoc) {
        const managerDoc = await fs.collection("managers").doc(currentManagerDoc.manager).get();
        if (managerDoc.exists) {
          setCurrentManager({ ...managerDoc.data(), ...currentManagerDoc });
        }
      }
  
      // Find previous managers
      const previousManagersDocs = managersData.filter((manager) => manager.endDate && new Date(manager.endDate) <= new Date());
      const previousManagersData = await Promise.all(
        previousManagersDocs.map(async (managerDoc) => {
          const managerData = await fs.collection("managers").doc(managerDoc.manager).get();
          return managerData.exists ? { ...managerData.data(), ...managerDoc } : null;
        })
      );
  
      setPreviousManager(previousManagersData.filter((manager) => manager !== null));
    } catch (error) {
      console.error("Error fetching managers data:", error.message);
    }
  };

  const fetchLeagueWins = async () => {
    try {
      const leagueWinsRef = fs.collection("teamLeagues").where("teamId", "==", id);
      const snapshot = await leagueWinsRef.get();
      const leagueWinsData = snapshot.docs.map((doc) => doc.data());
      setLeagueWins(leagueWinsData);
    } catch (error) {
      console.error("Error fetching league wins data:", error.message);
    }
  };

  const fetchStadiums = async () => {
    try {
      const stadiumsRef = fs.collection("stadiums").where("teamId", "==", id);
      const snapshot = await stadiumsRef.get();
      const stadiumData = snapshot.docs.map((doc) => ({
        id: doc.id,
       ...doc.data(),
      }));
      setStadium(stadiumData);
    } catch (error) {
      console.error("Error fetching stadiums:", error.message);
    }
  };
  
  const fetchTournaments = async () => {
    try {
      const tournamentsRef = fs.collection("teamTournaments").where("team", "==", id);
      const snapshot = await tournamentsRef.get();
      const teamTournamentData = snapshot.docs.map((doc) => doc.data());

      // Fetch actual achievement names
      const tournamentPromises = teamTournamentData.map(async (teamTournament) => {
        const tournamentDoc = await fs.collection("tournaments").doc(teamTournament.tournament).get();
        return tournamentDoc.exists ? { ...teamTournament, name: tournamentDoc.data().name } : null;
      });

      const tournamentsData = await Promise.all(tournamentPromises);
      setTournament(tournamentsData.filter(tournament => tournament !== null));
    } catch (error) {
      console.error("Error fetching tournaments data:", error.message);
    }
  };

  const fetchSponsors = async () => {
    try {
        const sponsorsRef = fs.collection("sponsorTeams").where("team", "==", id);
        const snapshot = await sponsorsRef.get();
        const sponsorTeamData = snapshot.docs.map((doc) => doc.data());
  
        // Fetch actual achievement names
        const sponsorPromises = sponsorTeamData.map(async (sponsorTeam) => {
          const sponsorDoc = await fs.collection("sponsors").doc(sponsorTeam.sponsor).get();
          return sponsorDoc.exists ? { ...sponsorTeam, name: sponsorDoc.data().name } : null;
        });
  
        const sponsorsData = await Promise.all(sponsorPromises);
        setSponsor(sponsorsData.filter(sponsor => sponsor !== null));
    } catch (error) {
        console.error("Error fetching sponsors data:", error.message);
    }
  };


  if (!team) {
    return <div>Loading...</div>;
  }

  const country = countries.find((c) => c.id === team.countryId);
  const league = leagues.find((l) => l.id === team.leagueId);

  return (
    <div className="teamprofile-container">
      <h2>{team.teamName}</h2>
      <p>Founded Date: {team.foundedDate}</p>
      <p>President: {team.president}</p>
      <p>League: {league ? league.name : "Unknown"}</p>
      <p>Nationality: {country ? country.name : "Unknown"}</p>

      <h3>Stadiums</h3>
      <ul>
        {stadiums.length > 0 ? (
          stadiums.map((stadium, index) => (
            <li key={index}>
              <p>Stadium: {stadium.name}</p>
              <p>Buid Date: {stadium.yearBuilt}</p>
              <p>Capacity: {stadium.capacity}</p>
            </li>
          ))
        ) : (
          <p>No stadiums yet</p>
        )}
      </ul>

      <h3>Current Manager</h3>
      {currentManager ? (
        <div>
          <p>Manager: {currentManager.name}</p>
          <p>Start date: {new Date(currentManager.startDate).getFullYear()}</p>
        </div>
      ) : (
        <p>Currently not managing any team</p>
      )}

      <h3>Previous Managers</h3>
      <ul>
        {previousManager.length > 0 ? (
          previousManager.map((manager, index) => (
            <li key={index}>
              <p>Manager: {manager.name}</p>
              <p>Start Date: {new Date(manager.startDate).getFullYear()}</p>
              <p>End Date: {new Date(manager.endDate).getFullYear()}</p>
            </li>
          ))
        ) : (
          <p>No previous Manager</p>
        )}
      </ul>

      <h3>League Wins</h3>
      <ul>
        {leagueWins.length > 0 ? (
          leagueWins.map((wins, index) => (
            <li key={index}>
              <p>Star Year: {wins.startYear}</p>
              <p>End Year: {wins.endYear}</p>
            </li>
          ))
        ) : (
          <p>No league won yet</p>
        )}
      </ul>

      <h3>Tournaments</h3>
      <ul>
        {tournaments.length > 0 ? (
          tournaments.map((tournament, index) => (
            <li key={index}>
              <p>Tournament: {tournament.name}</p>
              <p>Start Year: {tournament.startYear}</p>
              <p>End Year: {tournament.endYear}</p>
            </li>
          ))
        ) : (
          <p>No tournament won yet</p>
        )}
      </ul>

      <h3>Sponsors</h3>
      <ul>
        {sponsors.length > 0 ? (
          sponsors.map((sponsor, index) => (
            <li key={index}>
              <p>{sponsor.name}</p>
            </li>
          ))
        ) : (
          <p>No Sponsors</p>
        )}
      </ul>

    </div>
  );
};

export default TeamProfile;
