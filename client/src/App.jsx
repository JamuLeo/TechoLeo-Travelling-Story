import { BrowserRouter as Router, Routes, 
	Route, 
	Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import './index.css'; 

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Initial Route, handles redirection based on authentication */}
          <Route path="/" element={<Root />} />
          <Route path="/dashboard" element={<Home />} />
		  <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Redirect unknown paths to login */}
		 <Route path="*" element={<Navigate to="/login" />} />
         
        </Routes>
      </Router>
    </div>
  );
};

// Define the Root component to handle the initial redirect
const Root = () => {
	// Check if token exists is localstorage
	const isAuthenticated = !!localStorage.getItem('token');

	// Redirect to dashboard if authenticated, otherwise to login
	return isAuthenticated ? (
		<Navigate to="/dashboard" />
	) : (
		<Navigate to="/login" />
	);
};

export default App;
