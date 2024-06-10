import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Ensure this is your actual firebase config import
import "./Adminstyle/sponsor.css";

const Sponsor = () => {
  const [sponsorData, setSponsorData] = useState({
    name: ""
  });
  const [sponsors, setSponsors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  useEffect(() => {
    fetchSponsors();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsorData({ ...sponsorData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSponsor) {
        // Update existing sponsor
        await fs.collection("sponsors").doc(selectedSponsor.id).update(sponsorData);
        setShowForm(false);
        alert("Sponsor updated successfully!");
      } else {
        // Add new sponsor
        await fs.collection("sponsors").add(sponsorData);
        setSponsorData({
          name: ""
        });
        alert("Sponsor added successfully!");
      }
      fetchSponsors();
    } catch (error) {
      console.error("Error adding/updating sponsor:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {


      // Check if the sponsor is referenced by any sponsorTeams
      const sponsorTeamsRef = fs.collection("sponsorTeams");
      const sponsorTeamsSnapshot = await sponsorTeamsRef.where("sponsor", "==", id).get();
      if (!sponsorTeamsSnapshot.empty) {
        alert("Cannot delete sponsor: It is referenced by one or more sponsorTeams.");
        return;
      }

      await fs.collection("sponsors").doc(id).delete();
      alert("Sponsor deleted successfully!");
      fetchSponsors();
    } catch (error) {
      console.error("Error deleting sponsor:", error.message);
    }
  };

  const handleUpdate = (sponsor) => {
    setSelectedSponsor(sponsor);
    setSponsorData(sponsor);
    setShowForm(true);
  };

  return (
    <div className="sponsor-container">
      <h2>Sponsors</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id}>
              <td>{sponsor.name}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(sponsor.id)}>Delete</button>
                <button className="update-button" onClick={() => handleUpdate(sponsor)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button className="add-sponsor-button" onClick={() => {
        setSelectedSponsor(null);
        setSponsorData({ name: "" });
        setShowForm(true);
      }}>Add Sponsor</button>

      {showForm && (
        <div className="add-sponsor-container">
          <h2>{selectedSponsor ? "Update Sponsor" : "Add Sponsor"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={sponsorData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedSponsor ? (
              <button type="button" onClick={handleSubmit}>Update Sponsor</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Sponsor;
