import './Styles/listcountry.css'; // Import the CSS file
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fs, auth } from "../firebase_auth"; // Make sure to replace with your actual firebase config import

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  
  const fetchCountries = async () => {
    try {
      const countriesRef = fs.collection("countries");
      const snapshot = await countriesRef.get();
      const countryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCountries(countryData);
    } catch (error) {
      console.error("Error fetching countries:", error.message);
    } finally {
        setLoading(false);
      }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="country-container">
      <h2>All Countries</h2>
      <div className="country-list">
        {countries.map((country) => {
          return (
            <div key={country.id} className="country-card">
              <h3>{country.name}</h3>
              <button
                className="view-profile-button"
                onClick={() => navigate(`/country/${country.id}`)}
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountryList;
