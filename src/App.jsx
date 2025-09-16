/**
 * Main App Component
 * 
 * This is the root component of the Women@CS website application.
 * It sets up routing, authentication context, and the overall layout structure.
 * 
 * Features:
 * - React Router for navigation between pages
 * - Authentication context provider for user state
 * - Responsive layout with header, main content, and footer
 * - Animated background elements
 */

import React from 'react';
import Header from './Header.jsx';
import Home from './Home.jsx';
import Events from './Events.jsx';
import Contact from './Contact.jsx';
import Sponsors from './Sponsors.jsx';
import Feedback from './Feedback.jsx';
import Gallery from './Gallery.jsx';
import Dashboard from './Dashboard.jsx';
import Admin from './Admin.jsx';
import ResetPassword from './ResetPassword.jsx';
import Footer from './Footer.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    // Wrap entire app in authentication context
    <AuthProvider>
      <div className="app">
        {/* Animated background element for visual appeal */}
        <div className="animated-blob" />

        {/* Main application router */}
        <Router>
          {/* Navigation header */}
          <Header />
          
          {/* Main content area with page routing */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          
          {/* Footer component */}
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;