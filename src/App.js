import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import Keycloak from "./keycloak";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";



const PrivateRoute = ({ element }) => {
  const { keycloak } = useKeycloak();
  return keycloak.authenticated ? element : <h2>Access Denied</h2>;
};

const App = () => {

  const { keycloak, initialized } = useKeycloak();

 

  
  if (!initialized) return <div>Loading...</div>;

  return (
    <div>
      <h1>React + Keycloak Authentication</h1>
      {keycloak.authenticated ? (
        <>
          <p>Welcome, {keycloak.tokenParsed?.preferred_username}!</p>
          <button onClick={() => keycloak.logout()}>Logout</button>
        </>
      ) : (
        <button onClick={() => keycloak.login()}>Login</button>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </div>
  );
};

export default App;