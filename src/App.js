import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 
import './App.css'

import Navbar from "./Client/Navbar";
import Client from "./Client/Client";

import Login from "./Client/Login";
import SignUp from "./Client/Signup";

import ListPlayers from "./Client/ListPlayers"; 
import LikedPlayers from "./Client/LikedPlayers";

import ListTeams from "./Client/ListTeams";
import LikedTeams from "./Client/likedTeams";

import CountryList from "./Client/listCountries";

import LeagueList  from "./Client/listleagues";

import TournamentList from "./Client/listTournaments";

import TournamentProfile from "./Client/tournamentprofile";
import LeagueProfile from "./Client/leagueprofile";
import CountryProfile from "./Client/countryprofile";
import TeamProfile from "./Client/teamprofile";
import PlayerProfile from "./Client/playerprofile";

import HomePage from "./Client/Home";

 
//Admin waaly compoonents
import AdminNavbar from "./Admin/AdminNavbar";  
import Player from "./Admin/Players";
import Team from "./Admin/Teams";
import PlayerTeam from "./Admin/PlayerTeam";
import PlayerClubStat from "./Admin/PlayerClubStat"
import Achivment from "./Admin/Achivment"
import AchievementPlayer from "./Admin/AchivmentPlayer";
import Transfer from "./Admin/Transfer";
import Injury from "./Admin/Injuries";
import Country from "./Admin/Country";
import PlayerNationStat from "./Admin/PlayerNationStat";
import Stadium from "./Admin/Stadium";
import League from "./Admin/League";
import TeamLeague from "./Admin/TeamLeague";
import Manager from "./Admin/Manager";
import TeamManager from "./Admin/TeamManger";
import Tournament from "./Admin/Tournament";
import TeamTournament from "./Admin/TeamTournament";
import CountryTournament from "./Admin/CountryTournament";
import Sponsor from "./Admin/Sponsor";
import SponsorTeam from "./Admin/SponsorTeam";

const App = () => {
  return (
    <Router> 

      <Navbar />
      <AdminNavbar />

      <Routes> 
        <Route exact path="/" element={<HomePage/>} />
        <Route exact path="/client" element={<Client />} />
        <Route exact path="/likedPlayers" element={<LikedPlayers />} />
        <Route exact path="/likedTeams" element={<LikedTeams />} />
        
        <Route exact path="/listPlayers" element={<ListPlayers />} />
        <Route path="/player/:id" element={<PlayerProfile />} />

        <Route exact path="/listteams" element={<ListTeams />} />
        <Route path="/team/:id" element={<TeamProfile />} />

        <Route exact path="/listCountries" element={<CountryList />} />
        <Route path="/country/:id" element={<CountryProfile />} />

       <Route exact path="/listLeagues" element={<LeagueList />} />
       <Route path="/league/:id" element={<LeagueProfile />} />

        <Route exact path="/listTournaments" element={<TournamentList />} />
       <Route path="/tournament/:id" element={<TournamentProfile />} />

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} /> 

        {/*Admin Panel */}
 
        <Route exact path="/players" element={<Player/>} /> 
        <Route exact path="/teams" element={<Team/>} /> 
        <Route exact path="/playerteam" element={<PlayerTeam/>} /> 
        <Route exact path="/playerclubstat" element={<PlayerClubStat/>} />
        <Route exact path="/achivment" element={<Achivment/>} />
        <Route exact path="/achivmentplayer" element={<AchievementPlayer/>} />
        <Route exact path="/transfer" element={<Transfer/>} />
        <Route exact path="/injuries" element={<Injury/>} />
        <Route exact path="/country" element={<Country/>} />
        <Route exact path="/playerNationStat" element={<PlayerNationStat/>} />
        <Route exact path="/stadium" element={<Stadium/>} />
        <Route exact path="/league" element={<League/>} />
        <Route exact path="/teamLeague" element={<TeamLeague/>} />
        <Route exact path="/manager" element={<Manager/>} />
        <Route exact path="/teamManager" element={<TeamManager/>} />
        <Route exact path="/tournament" element={<Tournament/>} />
        <Route exact path="/teamtournament" element={<TeamTournament/>} />
        <Route exact path="/countrytournament" element={<CountryTournament/>} />
        <Route exact path="/sponsor" element={<Sponsor/>} />
        <Route exact path="/sponsorTeam" element={<SponsorTeam/>} />
        
      </Routes> 
    </Router>
  );
};

export default App;
