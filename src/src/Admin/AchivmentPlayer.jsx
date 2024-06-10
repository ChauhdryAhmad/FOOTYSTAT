import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const AchievementPlayer = () => {
  const [achievementPlayerData, setAchievementPlayerData] = useState({
    playerId: "",
    achievementId: "",
    year: ""
  });
  const [achievementPlayers, setAchievementPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAchievementPlayer, setSelectedAchievementPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchAchievements();
    fetchAchievementPlayers();
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

  const fetchAchievements = async () => {
    try {
      const achievementsRef = fs.collection("achievements");
      const snapshot = await achievementsRef.get();
      const achievementData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAchievements(achievementData);
    } catch (error) {
      console.error("Error fetching achievements:", error.message);
    }
  };

  const fetchAchievementPlayers = async () => {
    try {
      const achievementPlayersRef = fs.collection("achievementPlayers");
      const snapshot = await achievementPlayersRef.get();
      const achievementPlayerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAchievementPlayers(achievementPlayerData);
    } catch (error) {
      console.error("Error fetching player-achievements:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAchievementPlayerData({ ...achievementPlayerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAchievementPlayer) {
        // Update existing player-achievement
        await fs.collection("achievementPlayers").doc(selectedAchievementPlayer.id).update(achievementPlayerData);
        setShowForm(false);
        alert("Player-Achievement updated successfully!");
      } else {
        // Add new player-achievement
        await fs.collection("achievementPlayers").add(achievementPlayerData);
        setAchievementPlayerData({
          playerId: "",
          achievementId: "",
          year: ""
        });
        alert("Player-Achievement added successfully!");
      }
      fetchAchievementPlayers();
    } catch (error) {
      console.error("Error adding/updating player-achievement:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("achievementPlayers").doc(id).delete();
      alert("Player-Achievement deleted successfully!");
      fetchAchievementPlayers();
    } catch (error) {
      console.error("Error deleting player-achievement:", error.message);
    }
  };

  const handleUpdate = (achievementPlayer) => {
    setSelectedAchievementPlayer(achievementPlayer);
    setAchievementPlayerData(achievementPlayer);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Player Achievements</h2>

      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Achievement Name</th>
            <th>Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {achievementPlayers.map((achievementPlayer) => {
            const player = players.find((p) => p.id === achievementPlayer.playerId);
            const achievement = achievements.find((a) => a.id === achievementPlayer.achievementId);
            return (
              <tr key={achievementPlayer.id}>
                <td>{player ? player.name : "Unknown"}</td>
                <td>{achievement ? achievement.name : "Unknown"}</td>
                <td>{achievementPlayer.year}</td>
                <td>
                  <button onClick={() => handleDelete(achievementPlayer.id)}>Delete</button>
                  <button onClick={() => handleUpdate(achievementPlayer)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedAchievementPlayer(null);
        setAchievementPlayerData({
          playerId: "",
          achievementId: "",
          year: ""
        });
        setShowForm(true);
      }}>Add Player Achievement</button>

      {showForm && (
        <div>
          <h2>{selectedAchievementPlayer ? "Update Player Achievement" : "Add Player Achievement"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Player:
              <select
                name="playerId"
                value={achievementPlayerData.playerId}
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
              Achievement:
              <select
                name="achievementId"
                value={achievementPlayerData.achievementId}
                onChange={handleChange}
                required
              >
                <option value="">Select an achievement</option>
                {achievements.map((achievement) => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Year:
              <input
                type="number"
                name="year"
                value={achievementPlayerData.year}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedAchievementPlayer ? (
              <button type="button" onClick={handleSubmit}>Update Player Achievement</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AchievementPlayer;
