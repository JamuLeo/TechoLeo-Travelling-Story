import LOGO from "../assets/images/logo.png";
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import ProfileInfo from "./cards/ProfileInfo";
import SearchBar from "./Input/SearchBar";

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {

  const isToken = localStorage.getItem("token"); 
  const navigate = useNavigate();  // Initialize useNavigate

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-8 z-18">
      <img src={LOGO} alt="travel story" className="h-9" />
      
      {isToken && (
        <>
          <SearchBar 
            value={searchQuery} 
            onChange={({ target }) => setSearchQuery(target.value)} 
            handleSearch={handleSearch} 
            onClearSearch={onClearSearch} 
          />
          
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
