import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const TeamManager = () => {
  const [teamManagerData, setTeamManagerData] = useState({
    manager: "",
    team: "",
    startDate: "",
    endDate: ""
  });
  const [teamManagers, setTeamManagers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeamManager, setSelectedTeamManager] = useState(null);

  useEffect(() => {
    fetchTeamManagers();
    fetchManagers();
    fetchTeams();
  }, []);

  const fetchTeamManagers = async () => {
    try {
      const teamManagersRef = fs.collection("teamManagers");
      const snapshot = await teamManagersRef.get();
      const teamManagerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeamManagers(teamManagerData);
    } catch (error) {
      console.error("Error fetching team managers:", error.message);
    }
  };

  const fetchManagers = async () => {
    try {
      const managersRef = fs.collection("managers");
      const snapshot = await managersRef.get();
      const managerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setManagers(managerData);
    } catch (error) {
      console.error("Error fetching managers:", error.message);
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
    setTeamManagerData({ ...teamManagerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeamManager) {
        // Update existing team manager
        await fs.collection("teamManagers").doc(selectedTeamManager.id).update(teamManagerData);
        setShowForm(false);
        alert("Team Manager updated successfully!");
      } else {
        // Add new team manager
        await fs.collection("teamManagers").add(teamManagerData);
        setTeamManagerData({
          manager: "",
          team: "",
          startDate: "",
          endDate: ""
        });
        alert("Team Manager added successfully!");
      }
      fetchTeamManagers();
    } catch (error) {
      console.error("Error adding/updating team manager:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("teamManagers").doc(id).delete();
      alert("Team Manager deleted successfully!");
      fetchTeamManagers();
    } catch (error) {
      console.error("Error deleting team manager:", error.message);
    }
  };

  const handleUpdate = (teamManager) => {
    setSelectedTeamManager(teamManager);
    setTeamManagerData(teamManager);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Team Managers</h2>

      <table>
        <thead>
          <tr>
            <th>Manager</th>
            <th>Team</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teamManagers.map((teamManager) => (
            <tr key={teamManager.id}>
              <td>{managers.find(manager => manager.id === teamManager.manager)?.name}</td>
              <td>{teams.find(team => team.id === teamManager.team)?.teamName}</td> {/* Changed from team.name to team.teamName to match the field name in the data */}
              <td>{teamManager.startDate}</td>
              <td>{teamManager.endDate || "Currently Managing"}</td>
              <td>
                <button onClick={() => handleDelete(teamManager.id)}>Delete</button>
                <button onClick={() => handleUpdate(teamManager)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedTeamManager(null);
        setTeamManagerData({
          manager: "",
          team: "",
          startDate: "",
          endDate: ""
        });
        setShowForm(true);
      }}>Add Team Manager</button>

      {showForm && (
        <div>
          <h2>{selectedTeamManager ? "Update Team Manager" : "Add Team Manager"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Manager:
              <select
                name="manager"
                value={teamManagerData.manager}
                onChange={handleChange}
                required
              >
                <option value="">Select Manager</option>
                {managers.map(manager => (
                  <option key={manager.id} value={manager.id}>{manager.name}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Team:
              <select
                name="team"
                value={teamManagerData.team}
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
              Start Date:
              <input
                type="date"
                name="startDate"
                value={teamManagerData.startDate}
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
                value={teamManagerData.endDate}
                onChange={handleChange}
              />
            </label>
            <br />
            {selectedTeamManager ? (
              <button type="button" onClick={handleSubmit}>Update Team Manager</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
