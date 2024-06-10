import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Styles/playerprofile.css'; // Import the CSS file

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [countries, setCountries] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [previousTeams, setPreviousTeams] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [injuries, setInjuries] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const [nationalStats, setNationalStats] = useState([]);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    fetchPlayerData();
    fetchTeams();
    fetchCountries();
    fetchAchievements();
    fetchInjuries();
    fetchClubStats();
    fetchNationalStats();
    fetchTransfers();
  }, [id]);

  const fetchPlayerData = async () => {
    try {
      const playerRef = fs.collection("players").doc(id);
      const doc = await playerRef.get();
      if (doc.exists) {
        setPlayer(doc.data());
      }
    } catch (error) {
      console.error("Error fetching player data:", error.message);
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

  const fetchTeams = async () => {
    try {
      const playerTeamsRef = fs.collection("playerTeams").where("playerId", "==", id);
      const snapshot = await playerTeamsRef.get();
      const teamsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      // Find current team
      const currentTeamDoc = teamsData.find((team) => !team.endDate || new Date(team.endDate) > new Date());
      if (currentTeamDoc) {
        const teamDoc = await fs.collection("teams").doc(currentTeamDoc.teamId).get();
        if (teamDoc.exists) {
          setCurrentTeam({ ...teamDoc.data(), ...currentTeamDoc });
        }
      }
  
      // Find previous teams
      const previousTeamsDocs = teamsData.filter((team) => team.endDate && new Date(team.endDate) <= new Date());
      const previousTeamsData = await Promise.all(
        previousTeamsDocs.map(async (teamDoc) => {
          const teamData = await fs.collection("teams").doc(teamDoc.teamId).get();
          return teamData.exists ? { ...teamData.data(), ...teamDoc } : null;
        })
      );
  
      setPreviousTeams(previousTeamsData.filter((team) => team !== null));
    } catch (error) {
      console.error("Error fetching teams data:", error.message);
    }
  };

  const fetchInjuries = async () => {
    try {
      const injuriesRef = fs.collection("injuries").where("playerId", "==", id);
      const snapshot = await injuriesRef.get();
      const injuriesData = snapshot.docs.map((doc) => doc.data());
      setInjuries(injuriesData);
    } catch (error) {
      console.error("Error fetching injuries data:", error.message);
    }
  };
  
  const fetchAchievements = async () => {
    try {
      const achievementsRef = fs.collection("achievementPlayers").where("playerId", "==", id);
      const snapshot = await achievementsRef.get();
      const achievementPlayerData = snapshot.docs.map((doc) => doc.data());

      // Fetch actual achievement names
      const achievementPromises = achievementPlayerData.map(async (achievementPlayer) => {
        const achievementDoc = await fs.collection("achievements").doc(achievementPlayer.achievementId).get();
        return achievementDoc.exists ? { ...achievementPlayer, name: achievementDoc.data().name } : null;
      });

      const achievementsData = await Promise.all(achievementPromises);
      setAchievements(achievementsData.filter(achievement => achievement !== null));
    } catch (error) {
      console.error("Error fetching achievements data:", error.message);
    }
  };

  const fetchClubStats = async () => {
    try {
      const playerStatsRef = fs.collection("playerClubStats").where("playerId", "==", id);
      const snapshot = await playerStatsRef.get();
      const statsData = snapshot.docs.map((doc) => doc.data());

      // Fetch actual team names
      const statsPromises = statsData.map(async (playerStats) => {
        const teamsDoc = await fs.collection("teams").doc(playerStats.teamId).get();
        return teamsDoc.exists ? { ...playerStats, teamName: teamsDoc.data().teamName } : null;
      });

      const teamsData = await Promise.all(statsPromises);

      setPlayerStats(teamsData.filter(stats => stats != null));
    } catch (error) {
      console.error("Error fetching player stats:", error.message);
    }
  };

  const fetchNationalStats = async () => {
    try {
      const nationalStatsRef = fs.collection("playerNationStats").where("playerId", "==", id);
      const snapshot = await nationalStatsRef.get();
      const statsData = snapshot.docs.map((doc) => doc.data());

      // Fetch actual country names
      const statsPromises = statsData.map(async (nationStats) => {
        const countryDoc = await fs.collection("countries").doc(nationStats.countryId).get();
        return countryDoc.exists ? { ...nationStats, countryName: countryDoc.data().name } : null;
      });

      const nationalStatsData = await Promise.all(statsPromises);
      setNationalStats(nationalStatsData.filter(stats => stats != null));
    } catch (error) {
      console.error("Error fetching national stats:", error.message);
    }
  };

  const fetchTransfers = async () => {
    try {
      const transfersRef = fs.collection("transfers").where("playerId", "==", id);
      const snapshot = await transfersRef.get();
      const transfersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Fetch actual team names
      const transferPromises = transfersData.map(async (transfer) => {
        const fromTeamDoc = await fs.collection("teams").doc(transfer.prevTeamId).get();
        const toTeamDoc = await fs.collection("teams").doc(transfer.newTeamId).get();
        return {
          ...transfer,
          fromTeamName: fromTeamDoc.exists ? fromTeamDoc.data().teamName : "Unknown",
          toTeamName: toTeamDoc.exists ? toTeamDoc.data().teamName : "Unknown",
        };
      });

      const transfersWithTeamNames = await Promise.all(transferPromises);
      setTransfers(transfersWithTeamNames);
    } catch (error) {
      console.error("Error fetching transfers data:", error.message);
    }
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  const country = countries.find((c) => c.id === player.countryId);

  return (
    <div className="playerprofile-container">
      <h2>{player.name}</h2>
      <p>Position: {player.position}</p>
      <p>Nationality: {country ? country.name : "Unknown"}</p>
      <p>Birthdate: {player.dob}</p>
      <p>Height: {player.height} m</p>
      <p>Weight: {player.weight} kg</p>

      <h3>Current Team</h3>
      {currentTeam ? (
        <div>
          <p>Team: {currentTeam.teamName}</p>
          <p>Start Year: {new Date(currentTeam.startDate).getFullYear()}</p>
          <p>Shirt Number: {currentTeam.shirtNumber}</p>
          <p>Salary: ${currentTeam.salary}</p>
        </div>
      ) : (
        <p>Currently not playing for any team</p>
      )}

      <h3>Previous Teams</h3>
      <ul>
        {previousTeams.length > 0 ? (
          previousTeams.map((team, index) => (
            <li key={index}>
              <p>Team: {team.teamName}</p>
              <p>Start Year: {new Date(team.startDate).getFullYear()}</p>
              <p>End Year: {new Date(team.endDate).getFullYear()}</p>
              <p>Shirt Number: {team.shirtNumber}</p>
              <p>Salary: {team.salary}</p>
            </li>
          ))
        ) : (
          <p>No previous teams</p>
        )}
      </ul>

      <h3>Club Stats</h3>
      <ul>
        {playerStats.length > 0 ? (
          playerStats.map((stat, index) => (
            <li key={index}>
              <p>Team: {stat.teamName}</p>
              <p>Star Year: {stat.startYear}</p>
              <p>End Year: {stat.endYear}</p>
              <p>Matches Played: {stat.appearances}</p>
              <p>Goals: {stat.goals}</p>
              <p>Assists: {stat.assists}</p>
              <p>Yellow Card: {stat.yellowCards}</p>
              <p>Red Card: {stat.redCards}</p>
            </li>
          ))
        ) : (
          <p>No stats available</p>
        )}
      </ul>

      <h3>National Stats</h3>
      <ul>
        {nationalStats.length > 0 ? (
          nationalStats.map((stat, index) => (
            <li key={index}>
              <p>Country: {stat.countryName}</p>
              <p>Start Year: {stat.startYear}</p>
              <p>End Year: {stat.endYear}</p>
              <p>Matches Played: {stat.appearances}</p>
              <p>Goals: {stat.goals}</p>
              <p>Assists: {stat.assists}</p>
              <p>Yellow Cards: {stat.yellowCards}</p>
              <p>Red Cards: {stat.redCards}</p>
            </li>
          ))
        ) : (
          <p>No stats available</p>
        )}
      </ul>

      <h3>Achievements</h3>
      <ul>
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <li key={index}>
              <p>{achievement.name}</p>
              <p>{achievement.year}</p>
            </li>
          ))
        ) : (
          <p>No achievements available</p>
        )}
      </ul>

      <h3>Injuries</h3>
      <ul>
        {injuries.length > 0 ? (
          injuries.map((injury, index) => (
            <li key={index}>
              <p>Injury: {injury.injuryName}</p>
              <p>Start Date: {injury.startDate}</p>
              <p>End Date: {injury.endDate}</p>
              <p>Missed Matches: {injury.missedMatches}</p>
            </li>
          ))
        ) : (
          <p>No injuries reported</p>
        )}
      </ul>

      <h3>Transfers</h3>
      <ul>
        {transfers.length > 0 ? (
          transfers.map((transfer, index) => (
            <li key={index}>
              <p>From Team: {transfer.fromTeamName}</p>
              <p>To Team: {transfer.toTeamName}</p>
              <p>Transfer Date: {transfer.transferYear}</p>
              <p>Transfer Amount: ${transfer.transferFee}</p>
            </li>
          ))
        ) : (
          <p>No transfer history</p>
        )}
      </ul>
    </div>
  );
};

export default PlayerProfile;
