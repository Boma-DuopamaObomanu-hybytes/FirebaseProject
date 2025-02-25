import React from "react";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import Keycloak from "keycloak-js";

const Dashboard = () => {
  const { keycloak } = useKeycloak();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Username: {keycloak.tokenParsed?.preferred_username}</p>
      <p>Email: {keycloak.tokenParsed?.email}</p>
      <button onClick={() => keycloak.logout()}>Logout</button>
    </div>
  );
};

export default Dashboard;
