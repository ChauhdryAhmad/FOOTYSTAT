import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/league.css'; // Import the CSS file

const League = () => {
  const [leagueData, setLeagueData] = useState({
    name: "",
    foundedDate: "",
    countryId: ""
  });
  const [leagues, setLeagues] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);

  useEffect(() => {
    fetchLeagues();
    fetchCountries();
  }, []);

  const fetchLeagues = async () => {
    try {
      const leaguesRef = fs.collection("leagues");
      const snapshot = await leaguesRef.get();
      const leagueData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeagues(leagueData);
    } catch (error) {
      console.error("Error fetching leagues:", error.message);
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
    setLeagueData({ ...leagueData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLeague) {
        // Update existing league
        await fs.collection("leagues").doc(selectedLeague.id).update(leagueData);
        setShowForm(false);
        alert("League updated successfully!");
      } else {
        // Add new league
        await fs.collection("leagues").add(leagueData);
        setLeagueData({
          name: "",
          foundedDate: "",
          countryId: ""
        });
        alert("League added successfully!");
      }
      fetchLeagues();
    } catch (error) {
      console.error("Error adding/updating league:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {

      // Check if the league is referenced by any teamLeagues
      const teamLeaguesRef = fs.collection("teamLeagues");
      const teamLeaguesSnapshot = await teamLeaguesRef.where("leagueId", "==", id).get();
      if (!teamLeaguesSnapshot.empty) {
        alert("Cannot delete league: It is referenced by one or more teamLeagues.");
        return;
      }



      await fs.collection("leagues").doc(id).delete();
      alert("League deleted successfully!");
      fetchLeagues();
    } catch (error) {
      console.error("Error deleting league:", error.message);
    }
  };

  const handleUpdate = (league) => {
    setSelectedLeague(league);
    setLeagueData(league);
    setShowForm(true);
  };

  return (
    <div className="league-container">
      <h2>Leagues</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Founded Date</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leagues.map((league) => (
            <tr key={league.id}>
              <td>{league.name}</td>
              <td>{league.foundedDate}</td>
              <td>{countries.find(country => country.id === league.countryId)?.name}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(league.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(league)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button className="add-league-button" onClick={() => {
        setSelectedLeague(null);
        setLeagueData({
          name: "",
          foundedDate: "",
          countryId: ""
        });
        setShowForm(true);
      }}>Add League</button>

      {showForm && (
        <div className="league-form-container">
          <h2>{selectedLeague ? "Update League" : "Add League"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={leagueData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Founded Date:
              <input
                type="date"
                name="foundedDate"
                value={leagueData.foundedDate}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Country:
              <select
                name="countryId"
                value={leagueData.countryId}
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
            {selectedLeague ? (
              <button type="button" onClick={handleSubmit}>Update League</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default League;
