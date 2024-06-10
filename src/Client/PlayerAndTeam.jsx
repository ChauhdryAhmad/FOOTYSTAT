import React, { useState, useEffect } from 'react';
import { fs } from "../firebase_auth";
import './Signup'; // Import the CSS file

const PlayerAndTeam = ({ playerId }) => {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [teamInfo, setTeamInfo] = useState(null);

  useEffect(() => {
    const fetchPlayerAndTeamInfo = async () => {
      try {
        // Query the "playerTeams" collection to find the document with the given player ID
        const playerTeamQuery = await fs.collection("playerTeams").where("playerId", "==", playerId).get();
        if (!playerTeamQuery.empty) {
          // If a matching document is found, extract the team ID
          const teamId = playerTeamQuery.docs[0].data().teamId;

          // Fetch player info from "players" collection
          const playerQuery = await fs.collection("players").doc(playerId).get();
          const playerData = playerQuery.data();

          // Fetch team info from "teams" collection
          const teamQuery = await fs.collection("teams").doc(teamId).get();
          const teamData = teamQuery.data();

          // Set the state with fetched player and team info
          setPlayerInfo(playerData);
          setTeamInfo(teamData);
        } else {
          console.log("No player found with the given ID in the playerTeams collection.");
        }
      } catch (error) {
        console.error("Error fetching player and team info:", error);
      }
    };

    fetchPlayerAndTeamInfo();
  }, [playerId]);

  return (
    <div className="player-and-team-container">
      {playerInfo && teamInfo && (
        <div>
          <div className="player-info">
            <h2>Player Information</h2>
            <p>Name: {playerInfo.name}</p>
            <p>Position: {playerInfo.position}</p>
            <p>Date of birth: {playerInfo.dob}</p>
            {/* Add more player attributes as needed */}
          </div>

          <div className="team-info">
            <h2>Team Information</h2>
            <p>Name: {teamInfo.teamName}</p>
            <p>Country: {teamInfo.country}</p>
            <p>Founded: {teamInfo.founded}</p>
            <p>President: {teamInfo.president}</p>
            {/* Add more team attributes as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerAndTeam;















/*import React, { useState, useEffect } from "react";
import { fs, auth } from "../firebase_auth";
import PlayerAndTeam from "./PlayerAndTeam";

const ListPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

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

  const handleCheckProfile = (id) => {
    setSelectedPlayer(id);
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
                <button onClick={() => handleCheckProfile(player.id)}>Check Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
      {selectedPlayer && <PlayerAndTeam playerId={selectedPlayer} />}
    </div>
  );
};
 
export default ListPlayers;*/
