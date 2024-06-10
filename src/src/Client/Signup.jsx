import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../firebase_auth"; // Assuming you have a separate config file 
import "./Styles/signup.css";
import icon from "./images/icon.png";
//import messi_signup from "./images/messi_signup.png";
//import ronaldo_signup from "./images/ronaldo_signup.png";


const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      const userData = { displayName, email };

      await fs.collection("clients").doc(user.uid).set(userData);

      console.log("User signed up successfully!");
      alert("User signed up successfully!");
      navigate("/dlogin");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="header">
        <img src={icon} alt="FootyNote Icon" />
        <h1>FootyNote</h1>
      </div>
      <div className="signup-box">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account? <Link to="/dlogin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
