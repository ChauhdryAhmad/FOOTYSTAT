import React, { useEffect, useState } from "react";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const Achievement = () => {
  const [achievementData, setAchievementData] = useState({ name: "" });
  const [achievements, setAchievements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const achievementsRef = fs.collection("achievements");
      const snapshot = await achievementsRef.get();
      const achievementData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAchievements(achievementData);
    } catch (error) {
      console.error("Error fetching achievements:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAchievementData({ ...achievementData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAchievement) {
        // Update existing achievement
        await fs.collection("achievements").doc(selectedAchievement.id).update(achievementData);
        setShowForm(false);
        alert("Achievement updated successfully!");
      } else {
        // Add new achievement
        await fs.collection("achievements").add(achievementData);
        setAchievementData({ name: "" });
        alert("Achievement added successfully!");
      }
      fetchAchievements();
    } catch (error) {
      console.error("Error adding/updating achievement:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {

      // Check if the player is referenced by any achievementPlayers
      const achievementPlayersRef = fs.collection("achievementPlayers");
      const achievementPlayersSnapshot = await achievementPlayersRef.where("achievementId", "==", id).get();
      if (!achievementPlayersSnapshot.empty) {
        alert("Cannot delete player: It is referenced by one or more achievementPlayers.");
        return;
      }


      await fs.collection("achievements").doc(id).delete();
      alert("Achievement deleted successfully!");
      fetchAchievements();
    } catch (error) {
      console.error("Error deleting achievement:", error.message);
    }
  };

  const handleUpdate = (achievement) => {
    setSelectedAchievement(achievement);
    setAchievementData(achievement);
    setShowForm(true);
  };

  return (
    <div>
      <h2>Achievements</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((achievement) => (
            <tr key={achievement.id}>
              <td>{achievement.name}</td>
              <td>
                <button onClick={() => handleDelete(achievement.id)}>Delete</button>
                <button onClick={() => handleUpdate(achievement)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => {
        setSelectedAchievement(null);
        setAchievementData({ name: "" });
        setShowForm(true);
      }}>Add Achievement</button>

      {showForm && (
        <div>
          <h2>{selectedAchievement ? "Update Achievement" : "Add Achievement"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={achievementData.name}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            {selectedAchievement ? (
              <button type="button" onClick={handleSubmit}>Update Achievement</button>
            ) : (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Achievement;
