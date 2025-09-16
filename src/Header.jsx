import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import logo from './Images/logo.png';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import './App.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignIn = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="WOMEN@CS Logo" className="logo-image" />
            </Link>
          </div>
          <nav className="nav-menu">
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/sponsors" className="nav-link">Sponsors</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}
            {isAuthenticated && (user?.email === 'onuoraprecious@gmail.com' || user?._id === 'admin-user-id') && (
              <Link to="/admin" className="nav-link admin-link">Admin</Link>
            )}
            {/* Debug info - remove this later */}
            {isAuthenticated && (
              <div style={{fontSize: '10px', color: 'red', marginLeft: '10px'}}>
                Debug: {user?.email} | {user?._id}
              </div>
            )}
          </nav>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="welcome-text">
                Welcome, {user?.firstName}!
              </span>
              <button className="sign-out-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="sign-in-btn" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>

      {showLogin && (
        <Login 
          onClose={handleClose} 
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onSwitchToForgotPassword={handleForgotPassword}
        />
      )}

      {showRegister && (
        <Register 
          onClose={handleClose} 
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      {showForgotPassword && (
        <ForgotPassword 
          onClose={handleClose} 
          onSwitchToLogin={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};


export default Header;