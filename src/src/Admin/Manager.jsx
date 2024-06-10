import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const Manager = () => {
  const [managerData, setManagerData] = useState({
    name: "",
    dob: "",
    nationality: ""
  });
  const [managers, setManagers] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  useEffect(() => {
    fetchManagers();
    fetchNationalities();
  }, []);

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

  const fetchNationalities = async () => {
    try {
      const nationalitiesRef = fs.collection("countries");
      const snapshot = await nationalitiesRef.get();
      const nationalityData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNationalities(nationalityData);
    } catch (error) {
      console.error("Error fetching nationalities:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData({ ...managerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedManager) {
        // Update existing manager
        await fs.collection("managers").doc(selectedManager.id).update(managerData);
        setShowForm(false);
        alert("Manager updated successfully!");
      } else {
        // Add new manager
        await fs.collection("managers").add(managerData);
        setManagerData({
          name: "",
          dob: "",
          nationality: ""
        });
        alert("Manager added successfully!");
      }
      fetchManagers();
    } catch (error) {
      console.error("Error adding/updating manager:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {


      // Check if the manager is referenced by any teamManagers
      const teamManagersRef = fs.collection("teamManagers");
      const teamManagersSnapshot = await teamManagersRef.where("manager", "==", id).get();
      if (!teamManagersSnapshot.empty) {
        alert("Cannot delete manager: It is referenced by one or more teamManagers.");
        return;
      }



      await fs.collection("managers").doc(id).delete();
      alert("Manager deleted successfully!");
      fetchManagers();
    } catch (error) {
      console.error("Error deleting manager:", error.message);
    }
  };

  const handleUpdate = (manager) => {
    setSelectedManager(manager);
    setManagerData(manager);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Managers</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Nationality</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {managers.map((manager) => (
            <tr key={manager.id}>
              <td>{manager.name}</td>
              <td>{manager.dob}</td>
              <td>{nationalities.find(nationality => nationality.id === manager.nationality)?.name}</td>
              <td>
                <button onClick={() => handleDelete(manager.id)}>Delete</button>
                <button onClick={() => handleUpdate(manager)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedManager(null);
        setManagerData({
          name: "",
          dob: "",
          nationality: ""
        });
        setShowForm(true);
      }}>Add Manager</button>

      {showForm && (
        <div>
          <h2>{selectedManager ? "Update Manager" : "Add Manager"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={managerData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              DOB:
              <input
                type="date"
                name="dob"
                value={managerData.dob}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label>
              Nationality:
              <select
                name="nationality"
                value={managerData.nationality}
                onChange={handleChange}
                required
              >
                <option value="">Select Nationality</option>
                {nationalities.map(nationality => (
                  <option key={nationality.id} value={nationality.id}>{nationality.name}</option>
                ))}
              </select>
            </label>
            <br />
            {selectedManager ? (
              <button type="button" onClick={handleSubmit}>Update Manager</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Manager;
