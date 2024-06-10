import React, { useState, useEffect } from "react";
import { fs, auth } from "../firebase_auth";
import "./Styles/likedplayer.css"; // Ensure you have this CSS file

const LikedPlayers = () => {
  const [likedPlayers, setLikedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedPlayers();
  }, []);

  const fetchLikedPlayers = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const likedPlayersRef = fs.collection("liked_players").where("userId", "==", user.uid);
        const snapshot = await likedPlayersRef.get();
        const likedPlayersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikedPlayers(likedPlayersData);
      } else {
        console.error("No user is currently logged in!");
      }
    } catch (error) {
      console.error("Error fetching liked players:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading liked players...</p>;
  }

  return (
    <div className="liked-players-container">
      <h2>Liked Players</h2>
      {likedPlayers.length > 0 ? (
        <table className="liked-players-table">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Liked Time</th>
            </tr>
          </thead>
          <tbody>
            {likedPlayers.map((player) => (
              <tr key={player.id}>
                <td>{player.playerName}</td>
                <td>{new Date(player.likedTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No players liked yet.</p>
      )}
    </div>
  );
};

export default LikedPlayers;
