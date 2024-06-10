import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Ensure this is your actual firebase config import

const Tournament = () => {
  const [tournamentData, setTournamentData] = useState({ name: "" });
  const [tournaments, setTournaments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const tournamentsRef = fs.collection("tournaments");
      const snapshot = await tournamentsRef.get();
      const tournamentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournaments(tournamentData);
    } catch (error) {
      console.error("Error fetching tournaments:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournamentData({ ...tournamentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTournament) {
        // Update existing tournament
        await fs.collection("tournaments").doc(selectedTournament.id).update(tournamentData);
        setShowForm(false);
        alert("Tournament updated successfully!");
      } else {
        // Add new tournament
        await fs.collection("tournaments").add(tournamentData);
        setTournamentData({ name: "" });
        alert("Tournament added successfully!");
      }
      fetchTournaments();
    } catch (error) {
      console.error("Error adding/updating tournament:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {

      // Check if the tournament is referenced by any teamTournaments
      const teamTournamentsRef = fs.collection("teamTournaments");
      const teamTournamentsSnapshot = await teamTournamentsRef.where("tournament", "==", id).get();
      if (!teamTournamentsSnapshot.empty) {
        alert("Cannot delete tournament: It is referenced by one or more teamTournaments.");
        return;
      }

      // Check if the tournament is referenced by any countryTournaments
      const countryTournamentsRef = fs.collection("countryTournaments");
      const countryTournamentsSnapshot = await countryTournamentsRef.where("tournament", "==", id).get();
      if (!countryTournamentsSnapshot.empty) {
        alert("Cannot delete tournament: It is referenced by one or more countryTournaments.");
        return;
      }

      await fs.collection("tournaments").doc(id).delete();
      alert("Tournament deleted successfully!");
      fetchTournaments();
    } catch (error) {
      console.error("Error deleting tournament:", error.message);
    }
  };

  const handleUpdate = (tournament) => {
    setSelectedTournament(tournament);
    setTournamentData(tournament);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Tournaments</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map((tournament) => (
            <tr key={tournament.id}>
              <td>{tournament.name}</td>
              <td>
                <button onClick={() => handleDelete(tournament.id)}>Delete</button>
                <button onClick={() => handleUpdate(tournament)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedTournament(null);
        setTournamentData({ name: "" });
        setShowForm(true);
      }}>Add Tournament</button>

      {showForm && (
        <div>
          <h2>{selectedTournament ? "Update Tournament" : "Add Tournament"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={tournamentData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedTournament ? (
              <button type="button" onClick={handleSubmit}>Update Tournament</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Tournament;