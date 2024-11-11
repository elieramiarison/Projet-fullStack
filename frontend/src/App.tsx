import { useEffect, useState } from "react";
import Liste from "./articles/liste";
import Signin from './authentification/signin';
import Signup from './authentification/signup';
import { Button } from "@mui/material";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/liste');
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/liste" : "/signin"} />} />
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/liste" /> : <Signin onLogin={handleLogin} />}
      />
      <Route
        path="/signup"
        element={<Signup />}
      />
      <Route
        path="/liste"
        element={isAuthenticated ? (
          <>
            <Liste />
            <Button variant="contained" sx={{ top: '-5rem' }} onClick={handleLogout}>Déconnexion</Button>
          </>
        ) : (
          <Navigate to="/signin" />
        )}
      />
    </Routes>
  );
}

export default App;
