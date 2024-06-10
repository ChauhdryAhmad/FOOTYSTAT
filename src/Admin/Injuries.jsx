import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/injury.css'; // Import the CSS file

const Injury = () => {
  const [injuryData, setInjuryData] = useState({
    playerId: "",
    injuryName: "",
    startDate: "",
    endDate: ""
  });
  const [injuries, setInjuries] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInjury, setSelectedInjury] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchInjuries();
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

  const fetchInjuries = async () => {
    try {
      const injuriesRef = fs.collection("injuries");
      const snapshot = await injuriesRef.get();
      const injuryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInjuries(injuryData);
    } catch (error) {
      console.error("Error fetching injuries:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInjuryData({ ...injuryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInjury) {
        // Update existing injury
        await fs.collection("injuries").doc(selectedInjury.id).update(injuryData);
        setShowForm(false);
        alert("Injury updated successfully!");
      } else {
        // Add new injury
        await fs.collection("injuries").add(injuryData);
        setInjuryData({
          playerId: "",
          injuryName: "",
          startDate: "",
          endDate: ""
        });
        alert("Injury added successfully!");
      }
      fetchInjuries();
    } catch (error) {
      console.error("Error adding/updating injury:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("injuries").doc(id).delete();
      alert("Injury deleted successfully!");
      fetchInjuries();
    } catch (error) {
      console.error("Error deleting injury:", error.message);
    }
  };

  const handleUpdate = (injury) => {
    setSelectedInjury(injury);
    setInjuryData(injury);
    setShowForm(true);
  };

  return (
    <div className="injury-container">
      <h2>Injuries</h2>

      <table>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Injury Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {injuries.map((injury) => {
            const player = players.find((p) => p.id === injury.playerId);
            return (
              <tr key={injury.id}>
                <td>{player ? player.name : "Unknown"}</td>
                <td>{injury.injuryName}</td>
                <td>{injury.startDate}</td>
                <td>{injury.endDate ? injury.endDate : "Currently Injured"}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(injury.id)}>Delete</button>
                  <button className="update-button" onClick={() => handleUpdate(injury)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button className="add-injury-button" onClick={() => {
        setSelectedInjury(null);
        setInjuryData({
          playerId: "",
          injuryName: "",
          startDate: "",
          endDate: ""
        });
        setShowForm(true);
      }}>Add Injury</button>

      {showForm && (
        <div className="injury-form-container">
          <h2>{selectedInjury ? "Update Injury" : "Add Injury"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Player:
              <select
                name="playerId"
                value={injuryData.playerId}
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
              Injury Name:
              <input
                type="text"
                name="injuryName"
                value={injuryData.injuryName}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={injuryData.startDate}
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
                value={injuryData.endDate}
                onChange={handleChange}
              />
            </label>
            <br />
            {selectedInjury ? (
              <button type="button" onClick={handleSubmit}>Update Injury</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Injury;
