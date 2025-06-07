import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React from "react";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import './index.css';  // Ensure you import the CSS file

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Initial Route, handles redirection based on authentication */}
          <Route path="/" element={<Root />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
};

// Root component for handling initial redirection
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

// PrivateRoute component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Render the protected route's children if authenticated
};

export default App;
