import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Ensure this is your actual firebase config import
import "./Adminstyle/teamtournament.css";

const TeamTournament = () => {
  const [teamTournamentData, setTeamTournamentData] = useState({
    tournament: "",
    team: "",
    startYear: "",
    endYear: ""
  });
  const [teamTournaments, setTeamTournaments] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeamTournament, setSelectedTeamTournament] = useState(null);

  useEffect(() => {
    fetchTeamTournaments();
    fetchTournaments();
    fetchTeams();
  }, []);

  const fetchTeamTournaments = async () => {
    try {
      const teamTournamentsRef = fs.collection("teamTournaments");
      const snapshot = await teamTournamentsRef.get();
      const teamTournamentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeamTournaments(teamTournamentData);
    } catch (error) {
      console.error("Error fetching team tournaments:", error.message);
    }
  };

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
    setTeamTournamentData({ ...teamTournamentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeamTournament) {
        // Update existing team tournament
        await fs.collection("teamTournaments").doc(selectedTeamTournament.id).update(teamTournamentData);
        setShowForm(false);
        alert("Team Tournament updated successfully!");
      } else {
        // Add new team tournament
        await fs.collection("teamTournaments").add(teamTournamentData);
        setTeamTournamentData({
          tournament: "",
          team: "",
          startYear: "",
          endYear: ""
        });
        alert("Team Tournament added successfully!");
      }
      fetchTeamTournaments();
    } catch (error) {
      console.error("Error adding/updating team tournament:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("teamTournaments").doc(id).delete();
      alert("Team Tournament deleted successfully!");
      fetchTeamTournaments();
    } catch (error) {
      console.error("Error deleting team tournament:", error.message);
    }
  };

  const handleUpdate = (teamTournament) => {
    setSelectedTeamTournament(teamTournament);
    setTeamTournamentData(teamTournament);
    setShowForm(true);
  };

  return (
    <div className="teamtournament-container">
      <h2>Team Tournaments</h2>

      <table>
        <thead>
          <tr>
            <th>Tournament</th>
            <th>Team</th>
            <th>Start Year</th>
            <th>End Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teamTournaments.map((teamTournament) => (
            <tr key={teamTournament.id}>
              <td>{tournaments.find(tournament => tournament.id === teamTournament.tournament)?.name}</td>
              <td>{teams.find(team => team.id === teamTournament.team)?.teamName}</td> {/* Adjusted field name */}
              <td>{teamTournament.startYear}</td>
              <td>{teamTournament.endYear || "Currently Participating"}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(teamTournament.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(teamTournament)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button className="add-teamtournament-button" onClick={() => {
        setSelectedTeamTournament(null);
        setTeamTournamentData({
          tournament: "",
          team: "",
          startYear: "",
          endYear: ""
        });
        setShowForm(true);
      }}>Add Team Tournament</button>

      {showForm && (
        <div className="teamtournament-form-container">
          <h2>{selectedTeamTournament ? "Update Team Tournament" : "Add Team Tournament"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Tournament:
              <select
                name="tournament"
                value={teamTournamentData.tournament}
                onChange={handleChange}
                required
              >
                <option value="">Select Tournament</option>
                {tournaments.map(tournament => (
                  <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Team:
              <select
                name="team"
                value={teamTournamentData.team}
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
                value={teamTournamentData.startYear}
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
                value={teamTournamentData.endYear}
                onChange={handleChange}
              />
            </label>
            <br />
            {selectedTeamTournament ? (
              <button type="button" onClick={handleSubmit}>Update Team Tournament</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamTournament;
