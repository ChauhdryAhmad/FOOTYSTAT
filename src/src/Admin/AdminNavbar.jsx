import React from 'react';
import { Link } from 'react-router-dom';
//import '../Client/Styles/navbar.css'; 
import './Adminstyle/adminNavbar.css';

const AdminNavbar = () => {
   
  return (
    <div className="navbar">
      <div className='logo'>Admin Side</div>

      <div> 
        <Link to="/players" className="navbar-link">Add Player</Link> 
        <Link to="/teams" className="navbar-link">Add Team</Link> 
        <Link to="/playerteam" className="navbar-link">Add Player-Team</Link>
        <Link to="/playerclubstat" className="navbar-link">Add Player-Club-Stat</Link>
        <Link to="/achivment" className="navbar-link">Add Achivment</Link>
        <Link to="/achivmentplayer" className="navbar-link">Add Achivment-Player</Link>
        <Link to="/transfer" className="navbar-link">Add Transfer</Link>
        <Link to="/injuries" className="navbar-link">Add Injury</Link>
        <Link to="/country" className="navbar-link">Add Country</Link>
        <Link to="/playernationstat" className="navbar-link">Add Player-Nation-Stat</Link>
        <Link to="/stadium" className="navbar-link">Add Stadium</Link>
        <Link to="/league" className="navbar-link">Add League</Link>
        <Link to="/teamleague" className="navbar-link">Add Team-League</Link>
        <Link to="/manager" className="navbar-link">Add Manager</Link>
        <Link to="/teammanager" className="navbar-link">Add Team-Manager</Link>
        <Link to="/tournament" className="navbar-link">Add Tournament</Link>
        <Link to="/teamtournament" className="navbar-link">Add Team-Tournament</Link>
        <Link to="/countrytournament" className="navbar-link">Add Country-Tournament</Link>
        <Link to="/sponsor" className="navbar-link">Add Sponsor</Link>
        <Link to="/sponsorteam" className="navbar-link">Add Sponsor-Team</Link>
        





      </div>
    </div>
  );
};


export default AdminNavbar
