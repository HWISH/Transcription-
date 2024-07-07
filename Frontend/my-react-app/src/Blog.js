import React from 'react';
import './App.css';

import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.jpeg';
import image4 from './image4.jpg';

// ... existing code ...
const Blog = () => {
  return (
    <div className="blog-container">
      <h1 className="blog-title">Audio to Text Transcription</h1>
      <div className="blog-content">
        <div className="blog-section">
          <h2 className="blog-subtitle">What is Audio to Text Transcription?</h2>
          <img src={image1} alt="Audio to Text" className="blog-image" />
          <p className="blog-text">
            Audio to text transcription is the process of converting spoken language into written text. This technology is widely used in various fields such as journalism, legal, medical, and more.
          </p>
        </div>
        <div className="blog-section">
          <h2 className="blog-subtitle">How Does It Work?</h2>
          <img src={image2} alt="How It Works" className="blog-image" />
          <p className="blog-text">
            The transcription process involves capturing audio signals, processing them using speech recognition algorithms, and converting them into text. Modern transcription services use advanced machine learning models to achieve high accuracy.
          </p>
        </div>
        <div className="blog-section">
          <h2 className="blog-subtitle">Benefits of Audio to Text Transcription</h2>
          <img src={image3} alt="Benefits" className="blog-image" />
          <ul className="blog-list">
            <li>Improves accessibility for people with hearing impairments.</li>
            <li>Enables easy search and retrieval of information from audio recordings.</li>
            <li>Facilitates content creation and documentation.</li>
          </ul>
        </div>
        <div className="blog-section">
          <h2 className="blog-subtitle">Research and Articles</h2>
          <img src={image4} alt="Research" className="blog-image" />
          <p className="blog-text">
            According to a study by XYZ University, audio to text transcription can significantly improve the efficiency of data processing in various industries. Another research article published in ABC Journal highlights the advancements in speech recognition technology and its impact on transcription accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;