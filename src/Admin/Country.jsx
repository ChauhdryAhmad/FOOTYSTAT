import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Adminstyle/country.css'; // Import the CSS file

const Country = () => {
  const [countryData, setCountryData] = useState({ name: "" });
  const [countries, setCountries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

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
    setCountryData({ ...countryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCountry) {
        // Update existing country
        await fs.collection("countries").doc(selectedCountry.id).update(countryData);
        setShowForm(false);
        alert("Country updated successfully!");
      } else {
        // Add new country
        await fs.collection("countries").add(countryData);
        setCountryData({ name: "" });
        alert("Country added successfully!");
      }
      fetchCountries();
    } catch (error) {
      console.error("Error adding/updating country:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Check if the country is referenced by any players
      const playersRef = fs.collection("players");
      const playersSnapshot = await playersRef.where("countryId", "==", id).get();
      if (!playersSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more players.");
        return;
      }

      // Check if the country is referenced by any teams
      const teamsRef = fs.collection("teams");
      const teamsSnapshot = await teamsRef.where("countryId", "==", id).get();
      if (!teamsSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more teams.");
        return;
      }

      // Check if the country is referenced by any playerNationStats
      const playerNationStatsRef = fs.collection("playerNationStats");
      const playerNationStatsSnapshot = await playerNationStatsRef.where("countryId", "==", id).get();
      if (!playerNationStatsSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more playerNationStats.");
        return;
      }

      // Check if the country is referenced by any stadiums
      const stadiumsRef = fs.collection("stadiums");
      const stadiumsSnapshot = await stadiumsRef.where("countryId", "==", id).get();
      if (!stadiumsSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more stadiums.");
        return;
      }

      // Check if the country is referenced by any leagues
      const leaguesRef = fs.collection("leagues");
      const leaguesSnapshot = await leaguesRef.where("countryId", "==", id).get();
      if (!leaguesSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more leagues.");
        return;
      }

      // Check if the country is referenced by any managers
      const managersRef = fs.collection("managers");
      const managersSnapshot = await managersRef.where("nationality", "==", id).get();
      if (!managersSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more managers.");
        return;
      }

      // Check if the country is referenced by any countryTournaments
      const countryTournamentsRef = fs.collection("countryTournaments");
      const countryTournamentsSnapshot = await countryTournamentsRef.where("country", "==", id).get();
      if (!countryTournamentsSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more countryTournaments.");
        return;
      }

      // Check if the country is referenced by any sponsorTeams
      const sponsorTeamsRef = fs.collection("sponsorTeams");
      const sponsorTeamsSnapshot = await sponsorTeamsRef.where("country", "==", id).get();
      if (!sponsorTeamsSnapshot.empty) {
        alert("Cannot delete country: It is referenced by one or more sponsorTeams.");
        return;
      }





      // Delete country
      await fs.collection("countries").doc(id).delete();
      alert("Country deleted successfully!");
      fetchCountries();
    } catch (error) {
      console.error("Error deleting country:", error.message);
    }
  };

  const handleUpdate = (country) => {
    setSelectedCountry(country);
    setCountryData(country);
    setShowForm(true);
  };

  return (
    <div className="country-container">
      <h2>Countries</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.id}>
              <td>{country.name}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(country.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(country)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button className="add-country-button" onClick={() => {
        setSelectedCountry(null);
        setCountryData({ name: "" });
        setShowForm(true);
      }}>Add Country</button>

      {showForm && (
        <div className="country-form-container"> 
          <h2>{selectedCountry ? "Update Country" : "Add Country"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={countryData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedCountry ? (
              <button type="button" onClick={handleSubmit}>Update Country</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Country;
