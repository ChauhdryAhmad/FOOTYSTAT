import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fs } from "../firebase_auth"; // Make sure to replace with your actual firebase config import
import './Styles/countryprofile.css'; // Import the CSS file

const CountryProfile = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [loadingSponsors, setLoadingSponsors] = useState(true);

  useEffect(() => {
    fetchCountryData();
    fetchTournaments();
    fetchStadiums();
    fetchSponsors();
  }, [id]);

  const fetchCountryData = async () => {
    try {
      const countryRef = fs.collection("countries").doc(id);
      const doc = await countryRef.get();
      if (doc.exists) {
        console.log("Country data:", doc.data());
        setCountry(doc.data());
      } else {
        console.log("No such document for country!");
      }
    } catch (error) {
      console.error("Error fetching country data:", error.message);
    } finally {
      setLoadingCountry(false);
    }
  };

  const fetchStadiums = async () => {
    try {
      const stadiumsRef = fs.collection("stadiums").where("countryId", "==", id);
      const snapshot = await stadiumsRef.get();
      if (snapshot.empty) {
        console.log("No stadiums found for this country.");
      }
      const stadiumData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Stadiums data:", stadiumData);
      setStadiums(stadiumData);
    } catch (error) {
      console.error("Error fetching stadiums:", error.message);
    } finally {
      setLoadingStadiums(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      const tournamentsRef = fs.collection("countryTournaments").where("country", "==", id);
      const snapshot = await tournamentsRef.get();
      if (snapshot.empty) {
        console.log("No tournaments found for this country.");
      }
      const countryTournamentData = snapshot.docs.map((doc) => doc.data());

      const tournamentPromises = countryTournamentData.map(async (countryTournament) => {
        const tournamentDoc = await fs.collection("tournaments").doc(countryTournament.tournament).get();
        return tournamentDoc.exists ? { ...countryTournament, name: tournamentDoc.data().name } : null;
      });

      const tournamentsData = await Promise.all(tournamentPromises);
      console.log("Tournaments data:", tournamentsData.filter(tournament => tournament !== null));
      setTournaments(tournamentsData.filter(tournament => tournament !== null));
    } catch (error) {
      console.error("Error fetching tournaments data:", error.message);
    } finally {
      setLoadingTournaments(false);
    }
  };

  const fetchSponsors = async () => {
    try {
      const sponsorsRef = fs.collection("sponsorTeams").where("country", "==", id);
      const snapshot = await sponsorsRef.get();
      if (snapshot.empty) {
        console.log("No sponsors found for this country.");
      }
      const sponsorTeamData = snapshot.docs.map((doc) => doc.data());

      const sponsorPromises = sponsorTeamData.map(async (sponsorTeam) => {
        const sponsorDoc = await fs.collection("sponsors").doc(sponsorTeam.sponsor).get();
        return sponsorDoc.exists ? { ...sponsorTeam, name: sponsorDoc.data().name } : null;
      });

      const sponsorsData = await Promise.all(sponsorPromises);
      console.log("Sponsors data:", sponsorsData.filter(sponsor => sponsor !== null));
      setSponsors(sponsorsData.filter(sponsor => sponsor !== null));
    } catch (error) {
      console.error("Error fetching sponsors data:", error.message);
    } finally {
      setLoadingSponsors(false);
    }
  };

  if (loadingCountry || loadingTournaments || loadingStadiums || loadingSponsors) {
    return <div>Loading...</div>;
  }

  if (!country) {
    return <div>No country data available</div>;
  }

  return (
    <div className="countryprofile-container">
      <h2>{country.name}</h2>

      <h3>Stadiums</h3>
      <ul>
        {stadiums.length > 0 ? (
          stadiums.map((stadium, index) => (
            <li key={index}>
              <p>Stadium: {stadium.name}</p>
              <p>Build Date: {stadium.yearBuilt}</p>
              <p>Capacity: {stadium.capacity}</p>
            </li>
          ))
        ) : (
          <p>No stadiums yet</p>
        )}
      </ul>

      <h3>Tournaments</h3>
      <ul>
        {tournaments.length > 0 ? (
          tournaments.map((tournament, index) => (
            <li key={index}>
              <p>Tournament: {tournament.name}</p>
              <p>Start Year: {tournament.startYear}</p>
              <p>End Year: {tournament.endYear}</p>
            </li>
          ))
        ) : (
          <p>No tournaments won yet</p>
        )}
      </ul>

      <h3>Sponsors</h3>
      <ul>
        {sponsors.length > 0 ? (
          sponsors.map((sponsor, index) => (
            <li key={index}>
              <p>{sponsor.name}</p>
            </li>
          ))
        ) : (
          <p>No sponsors</p>
        )}
      </ul>
    </div>
  );
};

export default CountryProfile;
