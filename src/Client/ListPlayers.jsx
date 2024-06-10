import './Styles/listplayer.css'; // Import the CSS file
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fs, auth } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
    fetchCountries();
  }, []);

  const fetchPlayers = async () => {
    try {
      const playersRef = fs.collection("players");
      const snapshot = await playersRef.get();
      const playerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(playerData);
    } catch (error) {
      console.error("Error fetching players:", error.message);
    } finally {
      setLoading(false);
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

  const handleLike = async (id, currentLikes) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await fs.collection("players").doc(id).update({
          likes: currentLikes + 1,
        });
        // Store liked player with time
        await fs.collection("liked_players").add({
          userId: user.uid,
          playerId: id,
          likedTime: new Date().toISOString(),
        });
        fetchPlayers();
      } else {
        console.error("No user is currently logged in!");
      }
    } catch (error) {
      console.error("Error liking player:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="player-container">
      <h2>All Players</h2>
      <div className="player-list">
        {players.map((player) => {
          const country = countries.find((c) => c.id === player.countryId);
          return (
            <div key={player.id} className="player-card">
              <h3>{player.name}</h3>
              <p>DOB: {player.dob}</p>
              <p>Weight: {player.weight}</p>
              <p>Height: {player.height}</p>
              <p>Position: {player.position}</p>
              <p>Country: {country ? country.name : "Unknown"}</p>
              <p>Likes: {player.likes}</p>
              <button
                className="like-button"
                onClick={() => handleLike(player.id, player.likes)}
              >
                Like
              </button>
              <button
                className="view-profile-button"
                onClick={() => navigate(`/player/${player.id}`)}
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
