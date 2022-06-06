import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import DiscordCallback from './components/utils/DiscordCallback.jsx';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  // Redirect
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
// const URL = "https://discord.com/api/oauth2/authorize?client_id=964527215175938060&redirect_uri=https%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify%20guilds"


root.render(
  <Router>
    <Routes>
      <Route index element={<App />} />
      <Route path="./" element={<App />} />
      <Route path="/callback" element={<DiscordCallback />} />
      <Route path="*" element={<App />} />
    </Routes>
  </Router>
);


