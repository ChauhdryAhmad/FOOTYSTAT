import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const PlayerClubStat = () => {
  const [playerClubStatData, setPlayerClubStatData] = useState({
    playerId: "",
    teamId: "",
    startYear: "",
    endYear: "",
    appearances: "",
    goals: "",
    assists: "",
    redCards: "",
    yellowCards: "",
  });
  const [playerClubStats, setPlayerClubStats] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlayerClubStat, setSelectedPlayerClubStat] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
    fetchPlayerClubStats();
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

  const fetchPlayerClubStats = async () => {
    try {
      const playerClubStatsRef = fs.collection("playerClubStats");
      const snapshot = await playerClubStatsRef.get();
      const playerClubStatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayerClubStats(playerClubStatData);
    } catch (error) {
      console.error("Error fetching player-club statistics:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerClubStatData({ ...playerClubStatData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlayerClubStat) {
        // Update existing player-club statistic
        await fs.collection("playerClubStats").doc(selectedPlayerClubStat.id).update(playerClubStatData);
        setShowForm(false);
        alert("Player-Club statistic updated successfully!");
      } else {
        // Add new player-club statistic
        await fs.collection("playerClubStats").add(playerClubStatData);
        setPlayerClubStatData({
          playerId: "",
          teamId: "",
          startYear: "",
          endYear: "",
          appearances: "",
          goals: "",
          assists: "",
          redCards: "",
          yellowCards: "",
        });
        alert("Player-Club statistic added successfully!");
      }
      fetchPlayerClubStats();
    } catch (error) {
      console.error("Error adding/updating player-club statistic:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("playerClubStats").doc(id).delete();
      alert("Player-Club statistic deleted successfully!");
      fetchPlayerClubStats();
    } catch (error) {
      console.error("Error deleting player-club statistic:", error.message);
    }
  };

  const handleUpdate = (playerClubStat) => {
    setSelectedPlayerClubStat(playerClubStat);
    setPlayerClubStatData(playerClubStat);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Player-Club Statistics</h2>

      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Team Name</th>
            <th>Start Year</th>
            <th>End Year</th>
            <th>Appearances</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Red Cards</th>
            <th>Yellow Cards</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {playerClubStats.map((playerClubStat) => {
            const player = players.find((p) => p.id === playerClubStat.playerId);
            const team = teams.find((t) => t.id === playerClubStat.teamId);
            return (
              <tr key={playerClubStat.id}>
                <td>{player ? player.name : "Unknown"}</td>
                <td>{team ? team.teamName : "Unknown"}</td>
                <td>{playerClubStat.startYear}</td>
                <td>{playerClubStat.endYear || new Date().getFullYear()}</td>
                <td>{playerClubStat.appearances}</td>
                <td>{playerClubStat.goals}</td>
                <td>{playerClubStat.assists}</td>
                <td>{playerClubStat.redCards}</td>
                <td>{playerClubStat.yellowCards}</td>
                <td>{playerClubStat.endYear ? "Former Player" : "Current Player"}</td>
                <td>
                  <button onClick={() => handleDelete(playerClubStat.id)}>Delete</button>
                  <button onClick={() => handleUpdate(playerClubStat)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedPlayerClubStat(null);
        setPlayerClubStatData({
          playerId: "",
          teamId: "",
          startYear: "",
          endYear: "",
          appearances: "",
          goals: "",
          assists: "",
          redCards: "",
          yellowCards: "",
        });
        setShowForm(true);
      }}>Add Player-Club Statistic</button>

      {showForm && (
        <div>
          <h2>{selectedPlayerClubStat ? "Update Player-Club Statistic" : "Add Player-Club Statistic"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Player:
              <select
                name="playerId"
                value={playerClubStatData.playerId}
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
                value={playerClubStatData.teamId}
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
              Start Year:
              <input
                type="number"
                name="startYear"
                value={playerClubStatData.startYear}
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
                value={playerClubStatData.endYear}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Appearances:
              <input
                type="number"
                name="appearances"
                value={playerClubStatData.appearances}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Goals:
              <input
                type="number"
                name="goals"
                value={playerClubStatData.goals}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Assists:
              <input
                type="number"
                name="assists"
                value={playerClubStatData.assists}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Red Cards:
              <input
                type="number"
                name="redCards"
                value={playerClubStatData.redCards}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Yellow Cards:
              <input
                type="number"
                name="yellowCards"
                value={playerClubStatData.yellowCards}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedPlayerClubStat ? (
              <button type="button" onClick={handleSubmit}>Update Player-Club Statistic</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PlayerClubStat;
