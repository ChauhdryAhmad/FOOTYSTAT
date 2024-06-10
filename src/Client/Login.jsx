import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../firebase_auth"; // Assuming you have a separate config file
import "./Styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully!");

      const userDoc = await fs.collection("clients").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        navigate("/client", { state: userData }); // Pass user data to the Client component
      } else {
        throw new Error("User data not found in clients collection");
      }
    } catch (error) {
      alert("Incorrect Credentials!!!");
      alert(error.message);
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
