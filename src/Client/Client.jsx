import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, fs } from "../firebase_auth";
import "./Styles/client.css"; // Ensure you have the correct path

const Client = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    bio: "",
    city: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await fs.collection("clients").doc(user.uid).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.error("No such user found in clients collection!");
            alert("No user data found. Please try logging in again.");
            navigate("/dlogin");
          }
        } else {
          console.error("No user is currently logged in!");
          alert("No user is currently logged in. Please log in first.");
          navigate("/dlogin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await fs.collection("clients").doc(user.uid).set(userData);
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        console.error("No user is currently logged in!");
        alert("No user is currently logged in. Please log in first.");
        navigate("/dlogin");
      }
    } catch (error) {
      console.error("Error updating user data:", error.message);
      alert(error.message);
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="client-container">
      <h2>User Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <p><strong>Name:</strong> {userData.displayName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <label>
            Bio:
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleChange}
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {userData.displayName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Bio:</strong> {userData.bio}</p>
          <p><strong>City:</strong> {userData.city}</p>
          <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default Client;
