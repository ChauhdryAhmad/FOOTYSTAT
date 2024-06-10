import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const Transfer = () => {
  const [transferData, setTransferData] = useState({
    playerId: "",
    prevTeamId: "",
    newTeamId: "",
    transferYear: "",
    transferFee: ""
  });
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
    fetchTransfers();
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

  const fetchTransfers = async () => {
    try {
      const transfersRef = fs.collection("transfers");
      const snapshot = await transfersRef.get();
      const transferData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransfers(transferData);
    } catch (error) {
      console.error("Error fetching transfers:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferData({ ...transferData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTransfer) {
        // Update existing transfer
        await fs.collection("transfers").doc(selectedTransfer.id).update(transferData);
        setShowForm(false);
        alert("Transfer updated successfully!");
      } else {
        // Add new transfer
        await fs.collection("transfers").add(transferData);
        setTransferData({
          playerId: "",
          prevTeamId: "",
          newTeamId: "",
          transferYear: "",
          transferFee: ""
        });
        alert("Transfer added successfully!");
      }
      fetchTransfers();
    } catch (error) {
      console.error("Error adding/updating transfer:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("transfers").doc(id).delete();
      alert("Transfer deleted successfully!");
      fetchTransfers();
    } catch (error) {
      console.error("Error deleting transfer:", error.message);
    }
  };

  const handleUpdate = (transfer) => {
    setSelectedTransfer(transfer);
    setTransferData(transfer);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Transfers</h2>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Previous Team</th>
            <th>New Team</th>
            <th>Transfer Year</th>
            <th>Transfer Fee</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id}>
              <td>{players.find(player => player.id === transfer.playerId)?.name}</td>
              <td>{teams.find(team => team.id === transfer.prevTeamId)?.teamName}</td> {/* Changed name to teamName */}
              <td>{teams.find(team => team.id === transfer.newTeamId)?.teamName}</td> {/* Changed name to teamName */}
              <td>{transfer.transferYear}</td>
              <td>{transfer.transferFee}</td>
              <td>
                <button onClick={() => handleDelete(transfer.id)}>Delete</button>
                <button onClick={() => handleUpdate(transfer)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedTransfer(null);
        setTransferData({
          playerId: "",
          prevTeamId: "",
          newTeamId: "",
          transferYear: "",
          transferFee: ""
        });
        setShowForm(true);
      }}>Add Transfer</button>

      {showForm && (
        <div>
          <h2>{selectedTransfer ? "Update Transfer" : "Add Transfer"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Player:
              <select
                name="playerId"
                value={transferData.playerId}
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
              Previous Team:
              <select
                name="prevTeamId"
                value={transferData.prevTeamId}
                onChange={handleChange}
                required
              >
                <option value="">Select Previous Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.teamName}</option> 
                ))}
              </select>
            </label>
            <br />
            <label>
              New Team:
              <select
                name="newTeamId"
                value={transferData.newTeamId}
                onChange={handleChange}
                required
              >
                <option value="">Select New Team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.teamName}</option> 
                ))}
              </select>
            </label>
            <br />
            <label>
              Transfer Year:
              <input
                type="number"
                name="transferYear"
                value={transferData.transferYear}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Transfer Fee:
              <input
                type="number"
                name="transferFee"
                value={transferData.transferFee}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedTransfer ? (
              <button type="button" onClick={handleSubmit}>Update Transfer</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Transfer;
