import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/playerteam.css'; // Import the CSS file


const PlayerTeam = () => {
  const [playerTeamData, setPlayerTeamData] = useState({
    playerId: "",
    teamId: "",
    startDate: "",
    endDate: "",
    salary: "",
    shirtNumber: "",
  });
  const [playerTeams, setPlayerTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
    fetchPlayerTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const playersRef = fs.collection("players");
      const snapshot = await playersRef.get();
      const playerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(playerData);
    } catch (error) {
      console.error("Error fetching players:", error.message);
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

  const fetchPlayerTeams = async () => {
    try {
      const playerTeamsRef = fs.collection("playerTeams");
      const snapshot = await playerTeamsRef.get();
      const playerTeamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayerTeams(playerTeamData);
    } catch (error) {
      console.error("Error fetching player-team relationships:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerTeamData({ ...playerTeamData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlayerTeam) {
        // Update existing player-team relationship
        await fs.collection("playerTeams").doc(selectedPlayerTeam.id).update(playerTeamData);
        setShowForm(false);
        alert("Player-Team relationship updated successfully!");
      } else {
        // Add new player-team relationship
        await fs.collection("playerTeams").add(playerTeamData);
        setPlayerTeamData({
          playerId: "",
          teamId: "",
          startDate: "",
          endDate: "",
          salary: "",
          shirtNumber: "",
        });
        alert("Player-Team relationship added successfully!");
      }
      fetchPlayerTeams();
    } catch (error) {
      console.error("Error adding/updating player-team relationship:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("playerTeams").doc(id).delete();
      alert("Player-Team relationship deleted successfully!");
      fetchPlayerTeams();
    } catch (error) {
      console.error("Error deleting player-team relationship:", error.message);
    }
  };

  const handleUpdate = (playerTeam) => {
    setSelectedPlayerTeam(playerTeam);
    setPlayerTeamData(playerTeam);
    setShowForm(true);
  };

  return (
    <div className="playerteam-container">
      <h2>Player-Team Relationships</h2>

      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Team Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Salary</th>
            <th>Shirt Number</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {playerTeams.map((playerTeam) => {
            const player = players.find((p) => p.id === playerTeam.playerId);
            const team = teams.find((t) => t.id === playerTeam.teamId);
            return (
              <tr key={playerTeam.id}>
                <td>{player ? player.name : "Unknown"}</td>
                <td>{team ? team.teamName : "Unknown"}</td>
                <td>{playerTeam.startDate}</td>
                <td>{playerTeam.endDate || "Currently Playing"}</td>
                <td>{playerTeam.salary}</td>
                <td>{playerTeam.shirtNumber}</td>
                <td>{playerTeam.endDate ? "Former Player" : "Current Player"}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(playerTeam.id)}>Delete</button>
                  <button className="update-button" onClick={() => handleUpdate(playerTeam)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button className="add-playerteam-button" onClick={() => {
        setSelectedPlayerTeam(null);
        setPlayerTeamData({
          playerId: "",
          teamId: "",
          startDate: "",
          endDate: "",
          salary: "",
          shirtNumber: "",
        });
        setShowForm(true);
      }}>Add Player-Team Relationship</button>

      {showForm && (
        <div className="playerteam-form-container">
          <h2>{selectedPlayerTeam ? "Update Player-Team Relationship" : "Add Player-Team Relationship"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Player:
              <select
                name="playerId"
                value={playerTeamData.playerId}
                onChange={handleChange}
                required
              >
                <option value="">Select a player</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Team:
              <select
                name="teamId"
                value={playerTeamData.teamId}
                onChange={handleChange}
                required
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={playerTeamData.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={playerTeamData.endDate}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Salary:
              <input
                type="number"
                name="salary"
                value={playerTeamData.salary}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Shirt Number:
              <input
                type="number"
                name="shirtNumber"
                value={playerTeamData.shirtNumber}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedPlayerTeam ? (
              <button type="button" onClick={handleSubmit}>Update Player-Team</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PlayerTeam;
