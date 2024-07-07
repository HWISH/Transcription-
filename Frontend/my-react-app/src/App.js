import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaHome, FaBlog, FaPhone, FaInfoCircle, FaTachometerAlt } from 'react-icons/fa';
import './App.css';
import Dashboard from './Dashboard';
import Contact from './Contact';
import About from './About';
import Home from './Home';
import Blog from './Blog'; // Import Blog component

function App() {
  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <div>
            <h2>VoiceStream</h2>
            <nav>
              <ul>
                <li><Link to="/"><FaTachometerAlt className="icon" />Dashboard</Link></li>
                <li><Link to="/home"><FaHome className="icon" />Home</Link></li>
                <li><Link to="/blog"><FaBlog className="icon" />Blog</Link></li>
                <li><Link to="/contact"><FaPhone className="icon" />Contact Us</Link></li>
                <li><Link to="/about"><FaInfoCircle className="icon" />About Us</Link></li>
              </ul>
            </nav>
          </div>
          <div className="bottom-section">
            <p><Link to="/terms">Terms of Service</Link></p>
            <p><Link to="/policy">Privacy Policy</Link></p>
            <p>&copy; 2023 VoiceStream</p>
          </div>
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/blog" element={<Blog />} /> {/* Add Blog route */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<div>Terms of Service Content</div>} />
            <Route path="/policy" element={<div>Privacy Policy Content</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;