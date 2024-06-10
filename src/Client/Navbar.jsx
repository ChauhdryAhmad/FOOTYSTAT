import React from "react";
import { Link } from "react-router-dom"; 

const Navbar = () => { 

  return (
    <div className="navbar"> 
      <div className="logo">Client Side</div>
      <div className="navbardabba">
        <Link to="/" className="navbar-link">
          Home
        </Link>    
        <Link to="/listPlayers" className="navbar-link">
          Listed Players
        </Link>
        
        <Link to="/listteams" className="navbar-link">
          Listed Teams
        </Link>
        <Link to="/listCountries" className="navbar-link">
          Listed Countries
        </Link>
        <Link to="/listLeagues" className="navbar-link">
          Listed Leagues
        </Link>
        <Link to="/listTournaments" className="navbar-link">
         Listed Tournaments
        </Link>
        <Link to="/likedPlayers" className="navbar-link">
          Liked Players
        </Link>
        <Link to="/likedTeams" className="navbar-link">
          Liked Teams
        </Link>
        <Link to="/client" className="navbar-link">
          Profile
        </Link> 
        <Link to="/login" className="navbar-link">
          Login
        </Link>
        <Link to="/signup" className="navbar-link">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
 