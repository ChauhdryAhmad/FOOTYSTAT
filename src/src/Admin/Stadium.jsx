import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const Stadium = () => {
  const [stadiumData, setStadiumData] = useState({
    name: "",
    capacity: "",
    yearBuilt: "",
    countryId: "",
    teamId: ""
  });
  const [stadiums, setStadiums] = useState([]);
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState(null);

  useEffect(() => {
    fetchStadiums();
    fetchCountries();
    fetchTeams();
  }, []);

  const fetchStadiums = async () => {
    try {
      const stadiumsRef = fs.collection("stadiums");
      const snapshot = await stadiumsRef.get();
      const stadiumData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStadiums(stadiumData);
    } catch (error) {
      console.error("Error fetching stadiums:", error.message);
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
    setStadiumData({ ...stadiumData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStadium) {
        // Update existing stadium
        await fs.collection("stadiums").doc(selectedStadium.id).update(stadiumData);
        setShowForm(false);
        alert("Stadium updated successfully!");
      } else {
        // Add new stadium
        await fs.collection("stadiums").add(stadiumData);
        setStadiumData({
          name: "",
          capacity: "",
          yearBuilt: "",
          countryId: "",
          teamId: ""
        });
        alert("Stadium added successfully!");
      }
      fetchStadiums();
    } catch (error) {
      console.error("Error adding/updating stadium:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("stadiums").doc(id).delete();
      alert("Stadium deleted successfully!");
      fetchStadiums();
    } catch (error) {
      console.error("Error deleting stadium:", error.message);
    }
  };

  const handleUpdate = (stadium) => {
    setSelectedStadium(stadium);
    setStadiumData(stadium);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Stadiums</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Year Built</th>
            <th>Country</th>
            <th>Team</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stadiums.map((stadium) => {
            const country = countries.find((c) => c.id === stadium.countryId);
            const team = teams.find((t) => t.id === stadium.teamId);
            return (
              <tr key={stadium.id}>
                <td>{stadium.name}</td>
                <td>{stadium.capacity}</td>
                <td>{stadium.yearBuilt}</td>
                <td>{country ? country.name : "Unknown"}</td>
                <td>{team ? team.teamName : "Unknown"}</td>
                <td>
                  <button onClick={() => handleDelete(stadium.id)}>Delete</button>
                  <button onClick={() => handleUpdate(stadium)}>Update</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedStadium(null);
        setStadiumData({
          name: "",
          capacity: "",
          yearBuilt: "",
          countryId: "",
          teamId: ""
        });
        setShowForm(true);
      }}>Add Stadium</button>

      {showForm && (
        <div>
          <h2>{selectedStadium ? "Update Stadium" : "Add Stadium"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={stadiumData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Capacity:
              <input
                type="number"
                name="capacity"
                value={stadiumData.capacity}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Year Built:
              <input
                type="number"
                name="yearBuilt"
                value={stadiumData.yearBuilt}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Country:
              <select
                name="countryId"
                value={stadiumData.countryId}
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
            <br />
            <label>
              Team:
              <select
                name="teamId"
                value={stadiumData.teamId}
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
            {selectedStadium ? (
              <button type="button" onClick={handleSubmit}>Update Stadium</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Stadium;
