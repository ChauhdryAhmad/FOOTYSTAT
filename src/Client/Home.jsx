import React from "react";
import { Link } from "react-router-dom";
import "./Styles/homepage.css"; // Ensure you have the correct path

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to FootyStat</h1>
        <p>Your ultimate destination for football statistics</p>
      </header>
      <main className="homepage-main">
        <section className="intro">
          <h2>Discover and Participate in Tournaments</h2>
          <p>Find the best tournaments and join the action. Whether you're a player, a team, or a country, we have something for everyone.</p>
        </section>
        <section className="features">
          <div className="feature">
            <h3>Track Your Favorite Teams and Players</h3>
            <p>Keep up with your favorite teams and players, and never miss a moment of the action.</p>
          </div>
          <div className="feature">
            <h3>Join Exciting Competitions</h3>
            <p>Participate in the most exciting tournaments and showcase your skills on a global stage.</p>
          </div>
          <div className="feature">
            <h3>Stay Updated</h3>
            <p>Get real-time updates on match schedules, results, and much more.</p>
          </div>
        </section>
        <section className="cta">
          <Link to="/signup" className="cta-button">Join Now</Link>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
