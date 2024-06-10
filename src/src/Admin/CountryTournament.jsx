import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Ensure this is your actual firebase config import

const CountryTournament = () => {
  const [countryTournamentData, setCountryTournamentData] = useState({
    tournament: "",
    country: "",
    startYear: "",
    endYear: ""
  });
  const [countryTournaments, setCountryTournaments] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCountryTournament, setSelectedCountryTournament] = useState(null);

  useEffect(() => {
    fetchCountryTournaments();
    fetchTournaments();
    fetchCountries();
  }, []);

  const fetchCountryTournaments = async () => {
    try {
      const countryTournamentsRef = fs.collection("countryTournaments");
      const snapshot = await countryTournamentsRef.get();
      const countryTournamentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCountryTournaments(countryTournamentData);
    } catch (error) {
      console.error("Error fetching country tournaments:", error.message);
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
    setCountryTournamentData({ ...countryTournamentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCountryTournament) {
        // Update existing country tournament
        await fs.collection("countryTournaments").doc(selectedCountryTournament.id).update(countryTournamentData);
        setShowForm(false);
        alert("Country Tournament updated successfully!");
      } else {
        // Add new country tournament
        await fs.collection("countryTournaments").add(countryTournamentData);
        setCountryTournamentData({
          tournament: "",
          country: "",
          startYear: "",
          endYear: ""
        });
        alert("Country Tournament added successfully!");
      }
      fetchCountryTournaments();
    } catch (error) {
      console.error("Error adding/updating country tournament:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("countryTournaments").doc(id).delete();
      alert("Country Tournament deleted successfully!");
      fetchCountryTournaments();
    } catch (error) {
      console.error("Error deleting country tournament:", error.message);
    }
  };

  const handleUpdate = (countryTournament) => {
    setSelectedCountryTournament(countryTournament);
    setCountryTournamentData(countryTournament);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Country Tournaments</h2>

      <table>
        <thead>
          <tr>
            <th>Tournament</th>
            <th>Country</th>
            <th>Start Year</th>
            <th>End Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {countryTournaments.map((countryTournament) => (
            <tr key={countryTournament.id}>
              <td>{tournaments.find(tournament => tournament.id === countryTournament.tournament)?.name}</td>
              <td>{countries.find(country => country.id === countryTournament.country)?.name}</td>
              <td>{countryTournament.startYear}</td>
              <td>{countryTournament.endYear || "Currently Participating"}</td>
              <td>
                <button onClick={() => handleDelete(countryTournament.id)}>Delete</button>
                <button onClick={() => handleUpdate(countryTournament)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedCountryTournament(null);
        setCountryTournamentData({
          tournament: "",
          country: "",
          startYear: "",
          endYear: ""
        });
        setShowForm(true);
      }}>Add Country Tournament</button>

      {showForm && (
        <div>
          <h2>{selectedCountryTournament ? "Update Country Tournament" : "Add Country Tournament"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Tournament:
              <select
                name="tournament"
                value={countryTournamentData.tournament}
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
              Country:
              <select
                name="country"
                value={countryTournamentData.country}
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
                value={countryTournamentData.startYear}
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
                value={countryTournamentData.endYear}
                onChange={handleChange}
              />
            </label>
            <br />
            {selectedCountryTournament ? (
              <button type="button" onClick={handleSubmit}>Update Country Tournament</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CountryTournament;
