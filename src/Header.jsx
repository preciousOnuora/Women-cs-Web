import React from 'react';
import { Link } from 'react-router-dom';
import logo from './Images/logo.png';
import './App.css';

const Header = () => {
    return (
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="WOMEN@CS Logo" className="logo-image" />
            </Link>
          </div>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/sponsors" className="nav-link">Sponsors</Link>
          </nav>
          <button className="sign-in-btn">Sign In</button>
        </div>
      </header>
    );
  };
  
  export default Header;