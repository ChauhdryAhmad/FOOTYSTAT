import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/teamleague.css'; // Import the CSS file

const TeamLeague = () => {
  const [teamLeagueData, setTeamLeagueData] = useState({
    leagueId: "",
    teamId: "",
    startYear: "",
    endYear: ""
  });
  const [teamLeagues, setTeamLeagues] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeamLeague, setSelectedTeamLeague] = useState(null);

  useEffect(() => {
    fetchTeamLeagues();
    fetchLeagues();
    fetchTeams();
  }, []);

  const fetchTeamLeagues = async () => {
    try {
      const teamLeaguesRef = fs.collection("teamLeagues");
      const snapshot = await teamLeaguesRef.get();
      const teamLeagueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeamLeagues(teamLeagueData);
    } catch (error) {
      console.error("Error fetching team leagues:", error.message);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamLeagueData({ ...teamLeagueData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeamLeague) {
        // Update existing team league
        await fs.collection("teamLeagues").doc(selectedTeamLeague.id).update(teamLeagueData);
        setShowForm(false);
        alert("Team-League updated successfully!");
      } else {
        // Add new team league
        await fs.collection("teamLeagues").add(teamLeagueData);
        setTeamLeagueData({
          leagueId: "",
          teamId: "",
          startYear: "",
          endYear: ""
        });
        alert("Team-League added successfully!");
      }
      fetchTeamLeagues();
    } catch (error) {
      console.error("Error adding/updating team-league:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("teamLeagues").doc(id).delete();
      alert("Team-League deleted successfully!");
      fetchTeamLeagues();
    } catch (error) {
      console.error("Error deleting team-league:", error.message);
    }
  };

  const handleUpdate = (teamLeague) => {
    setSelectedTeamLeague(teamLeague);
    setTeamLeagueData(teamLeague);
    setShowForm(true);
  };

  return (
    <div className="teamleague-container">
      <h2>Team-Leagues</h2>

      <table>
        <thead>
          <tr>
            <th>League</th>
            <th>Team</th>
            <th>Start Year</th>
            <th>End Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teamLeagues.map((teamLeague) => (
            <tr key={teamLeague.id}>
              <td>{leagues.find(league => league.id === teamLeague.leagueId)?.name}</td>
              <td>{teams.find(team => team.id === teamLeague.teamId)?.teamName}</td> {/* Changed from team.name to team.teamName to match the field name in the data */}
              <td>{teamLeague.startYear}</td>
              <td>{teamLeague.endYear || "Currently Playing"}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(teamLeague.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(teamLeague)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button className="add-teamleague-button" onClick={() => {
        setSelectedTeamLeague(null);
        setTeamLeagueData({
          leagueId: "",
          teamId: "",
          startYear: "",
          endYear: ""
        });
        setShowForm(true);
      }}>Add Team-League</button>

      {showForm && (
        <div className="teamleague-form-container">
          <h2>{selectedTeamLeague ? "Update Team-League" : "Add Team-League"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              League:
              <select
                name="leagueId"
                value={teamLeagueData.leagueId}
                onChange={handleChange}
                required
              >
                <option value="">Select League</option>
                {leagues.map(league => (
                  <option key={league.id} value={league.id}>{league.name}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Team:
              <select
                name="teamId"
                value={teamLeagueData.teamId}
                onChange={handleChange}
                required
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.teamName}</option> 
                ))}
              </select>
            </label>
            <br />
            <label>
              Start Year:
              <input
                type="number"
                name="startYear"
                value={teamLeagueData.startYear}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              End Year:
              <input
                type="number"
                name="endYear"
                value={teamLeagueData.endYear}
                onChange={handleChange}
              />
            </label>
            <br />
            {selectedTeamLeague ? (
              <button type="button" onClick={handleSubmit}>Update Team-League</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamLeague;
