import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/player.css'; // Import the CSS file

const Player = () => {
  const [playerData, setPlayerData] = useState({
    name: "",
    dob: "",
    weight: "",
    height: "",
    position: "",
    likes: "",
    countryId: ""
  });
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchCountries();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerData({ ...playerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlayer) {
        await fs.collection("players").doc(selectedPlayer.id).update(playerData);
        setShowForm(false);
        alert("Player updated successfully!");
      } 
      else {
        await fs.collection("players").add(playerData);
        setPlayerData({
          name: "",
          dob: "",
          weight: "",
          height: "",
          position: "",
          likes: "",
          countryId: ""
        });
        alert("Player added successfully!");
      }
      fetchPlayers();
    } catch (error) {
      console.error("Error adding/updating player:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const playerTeamRef = fs.collection("playerTeams");
      const playerTeamSnapshot = await playerTeamRef.where("playerId", "==", id).get();
      if (!playerTeamSnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more playerteams.");
        return;
      }

      const playerClubStatRef = fs.collection("playerClubStats");
      const playerClubStatSnapshot = await playerClubStatRef.where("playerId", "==", id).get();
      if (!playerClubStatSnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more playerClubStats.");
        return;
      }

      const transferRef = fs.collection("transfers");
      const transferSnapshot = await transferRef.where("playerId", "==", id).get();
      if (!transferSnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more transfers.");
        return;
      }

      const injuryRef = fs.collection("injuries");
      const injurySnapshot = await injuryRef.where("playerId", "==", id).get();
      if (!injurySnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more injuries.");
        return;
      }

      const playerAchivmentsRef = fs.collection("achievementPlayers");
      const playerAchivmentsSnapshot = await playerAchivmentsRef.where("playerId", "==", id).get();
      if (!playerAchivmentsSnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more achievementPlayers.");
        return;
      }

      const playerNationStatsRef = fs.collection("playerNationStats");
      const playerNationStatsSnapshot = await playerNationStatsRef.where("playerId", "==", id).get();
      if (!playerNationStatsSnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more playerNationStats.");
        return;
      }

      await fs.collection("players").doc(id).delete();
      alert("Player deleted successfully!");
      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error.message);
    }
  };

  const handleUpdate = (player) => {
    setSelectedPlayer(player);
    setPlayerData(player);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Players</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Weight</th>
            <th>Height</th>
            <th>Position</th>
            <th>Likes</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const country = countries.find((c) => c.id === player.countryId);
            return (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.dob}</td>
                <td>{player.weight}</td>
                <td>{player.height}</td>
                <td>{player.position}</td>
                <td>{player.likes}</td>
                <td>{country ? country.name : "Unknown"}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(player.id)}>Delete</button>
                  <button className="update-button" onClick={() => handleUpdate(player)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedPlayer(null);
        setPlayerData({
          name: "",
          dob: "",
          weight: "",
          height: "",
          position: "",
          likes: "",
          countryId: ""
        });
        setShowForm(true);
      }}>Add Player</button>

      {showForm && (
        <div className="player-form-container">
          <h2>{selectedPlayer ? "Update Player" : "Add Player"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={playerData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              DOB:
              <input
                type="date"
                name="dob"
                value={playerData.dob}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Weight:
              <input
                type="number"
                name="weight"
                value={playerData.weight}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Height:
              <input
                type="number"
                name="height"
                value={playerData.height}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Position:
              <select
                name="position"
                value={playerData.position}
                onChange={handleChange}
                required
              >
                <option value="">Select a position</option>
                <option value="CAM">CAM</option>
                <option value="CB">CB</option>
                <option value="RB">RB</option>
                <option value="LB">LB</option>
                <option value="CM">CM</option>
                <option value="ST">ST</option>
                <option value="GK">GK</option>
              </select>
            </label>
            <label>
              Country:
              <select
                name="countryId"
                value={playerData.countryId}
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
            <button type="submit">{selectedPlayer ? "Update Player" : "Add Player"}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Player;
