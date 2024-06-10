import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Ensure this is your actual firebase config import

const SponsorTeam = () => {
  const [sponsorTeamData, setSponsorTeamData] = useState({
    sponsor: "",
    team: "N/A",
    country: "N/A"
  });
  const [sponsorTeams, setSponsorTeams] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSponsorTeam, setSelectedSponsorTeam] = useState(null);

  useEffect(() => {
    fetchSponsors();
    fetchTeams();
    fetchCountries();
    fetchSponsorTeams();
  }, []);

  const fetchSponsors = async () => {
    try {
      const sponsorsRef = fs.collection("sponsors");
      const snapshot = await sponsorsRef.get();
      const sponsorData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSponsors(sponsorData);
    } catch (error) {
      console.error("Error fetching sponsors:", error.message);
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

  const fetchSponsorTeams = async () => {
    try {
      const sponsorTeamsRef = fs.collection("sponsorTeams");
      const snapshot = await sponsorTeamsRef.get();
      const sponsorTeamData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSponsorTeams(sponsorTeamData);
    } catch (error) {
      console.error("Error fetching sponsor teams:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsorTeamData({ ...sponsorTeamData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = {
        ...sponsorTeamData,
        team: sponsorTeamData.team || "N/A",
        country: sponsorTeamData.country || "N/A"
      };

      if (selectedSponsorTeam) {
        // Update existing sponsor team
        await fs.collection("sponsorTeams").doc(selectedSponsorTeam.id).update(finalData);
        setShowForm(false);
        alert("SponsorTeam updated successfully!");
      } else {
        // Add new sponsor team
        await fs.collection("sponsorTeams").add(finalData);
        setSponsorTeamData({
          sponsor: "",
          team: "N/A",
          country: "N/A"
        });
        alert("SponsorTeam added successfully!");
      }
      fetchSponsorTeams();
    } catch (error) {
      console.error("Error adding/updating sponsor team:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fs.collection("sponsorTeams").doc(id).delete();
      alert("SponsorTeam deleted successfully!");
      fetchSponsorTeams();
    } catch (error) {
      console.error("Error deleting sponsor team:", error.message);
    }
  };

  const handleUpdate = (sponsorTeam) => {
    setSelectedSponsorTeam(sponsorTeam);
    setSponsorTeamData(sponsorTeam);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Sponsor Teams</h2>

      <table>
        <thead>
          <tr>
            <th>Sponsor</th>
            <th>Team</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sponsorTeams.map((sponsorTeam) => (
            <tr key={sponsorTeam.id}>
              <td>{sponsors.find(s => s.id === sponsorTeam.sponsor)?.name || "Unknown"}</td>
              <td>{teams.find(t => t.id === sponsorTeam.team)?.teamName || sponsorTeam.team}</td> {/* Adjusted field name */}
              <td>{countries.find(c => c.id === sponsorTeam.country)?.name || sponsorTeam.country}</td>
              <td>
                <button onClick={() => handleDelete(sponsorTeam.id)}>Delete</button>
                <button onClick={() => handleUpdate(sponsorTeam)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedSponsorTeam(null);
        setSponsorTeamData({ sponsor: "", team: "N/A", country: "N/A" });
        setShowForm(true);
      }}>Add Sponsor Team</button>

      {showForm && (
        <div>
          <h2>{selectedSponsorTeam ? "Update Sponsor Team" : "Add Sponsor Team"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Sponsor:
              <select name="sponsor" value={sponsorTeamData.sponsor} onChange={handleChange} required>
                <option value="">Select Sponsor</option>
                {sponsors.map((sponsor) => (
                  <option key={sponsor.id} value={sponsor.id}>{sponsor.name}</option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Team:
              <select name="team" value={sponsorTeamData.team} onChange={handleChange}>
                <option value="N/A">N/A</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.teamName}</option> 
                ))}
              </select>
            </label>
            <br />
            <label>
              Country:
              <select name="country" value={sponsorTeamData.country} onChange={handleChange}>
                <option value="N/A">N/A</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </label>
            <br />
            {selectedSponsorTeam ? (
              <button type="button" onClick={handleSubmit}>Update Sponsor Team</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SponsorTeam;
