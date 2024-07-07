import React from 'react';
import './App.css'; // Ensure this path is correct

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Our Platform</h1>
      <div className="about-content">
        <section className="about-section">
          <h2 className="about-subtitle">Our Platform</h2>
          <p className="about-text">
            Our platform leverages cutting-edge technology to provide accurate and efficient audio to text transcription services. We utilize advanced machine learning models to ensure high accuracy and reliability in our transcriptions.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-subtitle">The Model We Use</h2>
          <p className="about-text">
            We use state-of-the-art speech recognition models that have been trained on diverse datasets to handle various accents and languages. Our models are continuously updated to improve performance and accuracy.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-subtitle">Client Feedback</h2>
          <p className="about-text">
            Client feedback is crucial to our development process. We actively seek and incorporate feedback to enhance our services and ensure that we meet the needs of our users. Our clients appreciate the accuracy and speed of our transcriptions, and their input helps us to continually improve.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-subtitle">About Our Startup</h2>
          <p className="about-text">
            We are a dynamic startup focused on developing innovative solutions for audio to text transcription. Our team is passionate about leveraging technology to solve real-world problems. We work on various projects that aim to improve accessibility and efficiency in different industries.
          </p>
          <p className="about-text">
            Our mission is to make transcription services accessible to everyone, regardless of their technical expertise. We believe in the power of technology to bridge gaps and create opportunities for all.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;