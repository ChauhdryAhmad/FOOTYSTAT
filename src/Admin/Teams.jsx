import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/teams.css'; // Import the CSS file

const Team = () => {
  const [teamData, setTeamData] = useState({
    teamName: "",
    foundedDate: "",
    president: "",
    countryId: "",
    leagueId: "", // Add leagueId to the state
    likes: 0
  });
  const [teams, setTeams] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]); // Add state for leagues
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
    fetchCountries();
    fetchLeagues(); // Fetch leagues
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeam) {
        // Update existing team
        await fs.collection("teams").doc(selectedTeam.id).update(teamData);
        setShowForm(false);
        alert("Team updated successfully!");
      } else {
        // Add new team
        await fs.collection("teams").add(teamData);
        setTeamData({
          teamName: "",
          foundedDate: "",
          president: "",
          countryId: "",
          leagueId: "", // Reset leagueId
          likes: 0
        });
        alert("Team added successfully!");
      }
      fetchTeams();
    } catch (error) {
      console.error("Error adding/updating team:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Check if the team is referenced by any playerTeams
      const playerTeamRef = fs.collection("playerTeams");
      const playerTeamSnapshot = await playerTeamRef.where("teamId", "==", id).get();
      if (!playerTeamSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more player team.");
        return;
      }

      // Check if the team is referenced by any playerClubStats
      const playerClubStatRef = fs.collection("playerClubStats");
      const playerClubStatSnapshot = await playerClubStatRef.where("teamId", "==", id).get();
      if (!playerClubStatSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more player club stat.");
        return;
      }

      // Check if the team is referenced by any transfers
      const transferRef = fs.collection("transfers");
      const transferSnapshot = await transferRef.where("prevTeamId", "==", id).get();
      if (!transferSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more transfer.");
        return;
      }

      // Check if the team is referenced by any transfers
      const transfer2Ref = fs.collection("transfers");
      const transfer2Snapshot = await transfer2Ref.where("newTeamId", "==", id).get();
      if (!transfer2Snapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more transfer.");
        return;
      }

      // Check if the team is referenced by any stadiums
      const stadiumsRef = fs.collection("stadiums");
      const stadiumsSnapshot = await stadiumsRef.where("teamId", "==", id).get();
      if (!stadiumsSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more stadiums.");
        return;
      }

      // Check if the team is referenced by any teamLeagues
      const teamLeaguesRef = fs.collection("teamLeagues");
      const teamLeaguesSnapshot = await teamLeaguesRef.where("teamId", "==", id).get();
      if (!teamLeaguesSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more teamLeagues.");
        return;
      }

      // Check if the team is referenced by any teamManagers
      const teamManagersRef = fs.collection("teamManagers");
      const teamManagersSnapshot = await teamManagersRef.where("team", "==", id).get();
      if (!teamManagersSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more teamManagers.");
        return;
      }

      // Check if the team is referenced by any teamTournaments
      const teamTournamentsRef = fs.collection("teamTournaments");
      const teamTournamentsSnapshot = await teamTournamentsRef.where("team", "==", id).get();
      if (!teamTournamentsSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more teamTournaments.");
        return;
      }

      // Check if the team is referenced by any sponsorTeams
      const sponsorTeamsRef = fs.collection("sponsorTeams");
      const sponsorTeamsSnapshot = await sponsorTeamsRef.where("team", "==", id).get();
      if (!sponsorTeamsSnapshot.empty) {
        alert("Cannot delete team: It is referenced by one or more sponsorTeams.");
        return;
      }

      await fs.collection("teams").doc(id).delete();
      alert("Team deleted successfully!");
      fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error.message);
    }
  };

  const handleUpdate = (team) => {
    setSelectedTeam(team);
    setTeamData(team);
    setShowForm(true);
  };

  return (
    <div className="team-container">
      <h2>Teams</h2>

      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Founded Date</th>
            <th>President</th>
            <th>Country</th>
            <th>League</th> {/* Add column for league */}
            <th>Likes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => {
            const country = countries.find((c) => c.id === team.countryId);
            const league = leagues.find((l) => l.id === team.leagueId); // Find league
            return (
              <tr key={team.id}>
                <td>{team.teamName}</td>
                <td>{team.foundedDate}</td>
                <td>{team.president}</td>
                <td>{country ? country.name : "Unknown"}</td>
                <td>{league ? league.name : "Unknown"}</td> {/* Display league name */}
                <td>{team.likes}</td>
                <td>
                <button className="delete-button" onClick={() => handleDelete(team.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(team)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button className="add-team-button" onClick={() => {
        setSelectedTeam(null);
        setTeamData({
          teamName: "",
          foundedDate: "",
          president: "",
          countryId: "",
          leagueId: "", // Reset leagueId
          likes: 0
        });
        setShowForm(true);
      }}>Add Team</button>

      {showForm && (
        <div className="team-form-container">
          <h2>{selectedTeam ? "Update Team" : "Add Team"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Team Name:
              <input
                type="text"
                name="teamName"
                value={teamData.teamName}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Founded Date:
              <input
                type="date"
                name="foundedDate"
                value={teamData.foundedDate}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              President:
              <input
                type="text"
                name="president"
                value={teamData.president}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Country:
              <select
                name="countryId"
                value={teamData.countryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              League:
              <select
                name="leagueId"
                value={teamData.leagueId}
                onChange={handleChange}
                required
              >
                <option value="">Select a league</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            {selectedTeam ? (
              <button type="button" onClick={handleSubmit}>Update Team</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Team;
