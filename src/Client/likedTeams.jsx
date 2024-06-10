import React, { useState, useEffect } from "react";
import { fs, auth } from "../firebase_auth";
import "./Styles/likedteams.css";

const LikedTeams = () => {
  const [likedTeams, setLikedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedTeams();
  }, []);

  const fetchLikedTeams = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const likedTeamsRef = fs.collection("liked_teams").where("userId", "==", user.uid);
        const snapshot = await likedTeamsRef.get();
        const likedTeamsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const teamData = doc.data();
            const teamDoc = await fs.collection("teams").doc(teamData.teamId).get();
            return {
              id: doc.id,
              teamName: teamDoc.exists ? teamDoc.data().teamName : "Unknown Team",
              likedTime: teamData.likedTime,
            };
          })
        );
        setLikedTeams(likedTeamsData);
      } else {
        console.error("No user is currently logged in!");
      }
    } catch (error) {
      console.error("Error fetching liked teams:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading liked teams...</p>;
  }

  return (
    <div className="liked-teams-container">
      <h2>Liked Teams</h2>
      {likedTeams.length > 0 ? (
        <table className="liked-teams-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Liked Time</th>
            </tr>
          </thead>
          <tbody>
            {likedTeams.map((team) => (
              <tr key={team.id}>
                <td>{team.teamName}</td>
                <td>{new Date(team.likedTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No teams liked yet.</p>
      )}
    </div>
  );
};

export default LikedTeams;
