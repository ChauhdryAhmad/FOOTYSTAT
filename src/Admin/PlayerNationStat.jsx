import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/playernationstat.css';

const PlayerNationStat = () => {
  const [statData, setStatData] = useState({
    playerId: "",
    countryId: "",
    startYear: "",
    endYear: "",
    appearances: "",
    goals: "",
    assists: "",
    redCards: "",
    yellowCards: ""
  });
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stats, setStats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchCountries();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const statsRef = fs.collection("playerNationStats");
      const snapshot = await statsRef.get();
      const statData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStats(statData);
    } catch (error) {
      console.error("Error fetching stats:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatData({ ...statData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStat) {
        // Update existing stat
        await fs.collection("playerNationStats").doc(selectedStat.id).update(statData);
        setShowForm(false);
        alert("Stat updated successfully!");
      } else {
        // Add new stat
        await fs.collection("playerNationStats").add(statData);
        setStatData({
          playerId: "",
          countryId: "",
          startYear: "",
          endYear: "",
          appearances: "",
          goals: "",
          assists: "",
          redCards: "",
          yellowCards: ""
        });
        alert("Stat added successfully!");
      }
      fetchStats();
    } catch (error) {
      console.error("Error adding/updating stat:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("playerNationStats").doc(id).delete();
      alert("Stat deleted successfully!");
      fetchStats();
    } catch (error) {
      console.error("Error deleting stat:", error.message);
    }
  };

  const handleUpdate = (stat) => {
    setSelectedStat(stat);
    setStatData(stat);
    setShowForm(true);
  };

  return (
    <div className="playernationstat-container">
      <h2>Player Nation Stats</h2>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Country</th>
            <th>Start Year</th>
            <th>End Year</th>
            <th>Appearances</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Red Cards</th>
            <th>Yellow Cards</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.id}>
              <td>{players.find(player => player.id === stat.playerId)?.name}</td>
              <td>{countries.find(country => country.id === stat.countryId)?.name}</td>
              <td>{stat.startYear}</td>
              <td>{stat.endYear || "Currently Playing"}</td>
              <td>{stat.appearances}</td>
              <td>{stat.goals}</td>
              <td>{stat.assists}</td>
              <td>{stat.redCards}</td>
              <td>{stat.yellowCards}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(stat.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(stat)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button className="add-playernationstat-button" onClick={() => {
        setSelectedStat(null);
        setStatData({
          playerId: "",
          countryId: "",
          startYear: "",
          endYear: "",
          appearances: "",
          goals: "",
          assists: "",
          redCards: "",
          yellowCards: ""
        });
        setShowForm(true);
      }}>Add Player Nation Stat</button>

      {showForm && (
        <div className="playernationstat-form-container">
          <h2>{selectedStat ? "Update Player Nation Stat" : "Add Player Nation Stat"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Player:
              <select
                name="playerId"
                value={statData.playerId}
                onChange={handleChange}
                required
              >
                <option value="">Select Player</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Country:
              <select
                name="countryId"
                value={statData.countryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Start Year:
              <input
                type="number"
                name="startYear"
                value={statData.startYear}
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
                value={statData.endYear}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Appearances:
              <input
                type="number"
                name="appearances"
                value={statData.appearances}
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
                value={statData.goals}
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
                value={statData.assists}
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
                value={statData.redCards}
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
                value={statData.yellowCards}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedStat ? (
              <button type="button" onClick={handleSubmit}>Update Player Nation Stat</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PlayerNationStat;
