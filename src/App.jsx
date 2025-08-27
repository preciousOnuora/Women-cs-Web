import React from 'react';
import Header from './Header.jsx';
import Home from './Home.jsx';
import Events from './Events.jsx';
import Contact from './Contact.jsx';
import Sponsors from './Sponsors.jsx';
import Feedback from './Feedback.jsx';
import Gallery from './Gallery.jsx';
import Dashboard from './Dashboard.jsx';
import ResetPassword from './ResetPassword.jsx';
import Footer from './Footer.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        {/* Background Blob */}
        <div className="animated-blob" />

        {/* Router and Content */}
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;