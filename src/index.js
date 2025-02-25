import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

// Get the root element
const rootElement = document.getElementById("root");

// Ensure it exists before rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ReactKeycloakProvider authClient={keycloak}>
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    </ReactKeycloakProvider>
  );
} else {
  console.error("Root element not found");
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
