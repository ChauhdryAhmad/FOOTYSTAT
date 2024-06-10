import React, { useState, useEffect } from "react";
import { fs, auth } from "../firebase_auth";

const ListPlayers = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
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
    }
  };

  const handleLike = async (id, currentLikes) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const playerRef = fs.collection("players").doc(id);
        await playerRef.update({ likes: Number(currentLikes) + 1 });

        // Store liked player with time
        await fs.collection("liked_players").add({
          userId: user.uid,
          playerName: players.find((player) => player.id === id).name,
          likedTime: new Date().toISOString(),
        });
        fetchPlayers();
      } else {
        console.error("No user is currently logged in!");
      }
    } catch (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  return (
    <div>
      <h2>Players</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team Name</th>
            <th>DOB</th>
            <th>Shirt Number</th>
            <th>Likes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.teamName}</td>
              <td>{player.dob}</td>
              <td>{player.shirtNumber}</td>
              <td>{player.likes}</td>
              <td>
                <button onClick={() => handleLike(player.id, player.likes)}>Like</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPlayers;
