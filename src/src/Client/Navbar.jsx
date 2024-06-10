import React from "react";
import { Link } from "react-router-dom";
import "./Styles/navbar.css";

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
        <Link to="/likedPlayers" className="navbar-link">
          Liked Players
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
 