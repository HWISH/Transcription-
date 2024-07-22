// Frontend/my-react-app/src/Dashboard.js
import React, { useState } from 'react';
import './App.css';

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [transcription, setTranscription] = useState('');
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      console.log(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTranscription(data.transcription);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while transcribing the file.');
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission
    console.log(feedback);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="service-description">
        <h2 className="service-title">Welcome to Our Transcription Service</h2>
        <p className="service-text">Easily convert your audio files to text with our state-of-the-art transcription service. Simply upload your audio file or drag and drop it into the designated area below.</p>
      </div>
      <div className="upload-section">
        <h2 className="section-title">Upload Audio</h2>
        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <p>Drag & Drop your audio file here or click to upload</p>
          <input type="file" className="file-input" onChange={handleFileChange} />
        </div>
        <button className="upload-button" onClick={() => document.querySelector('.file-input').click()}>Upload from Files</button>
        <button className="transcribe-button" onClick={handleTranscribe}>Transcribe</button>
        {transcription && (
          <div className="transcription-result">
            <h3>Transcription Result:</h3>
            <p>{transcription}</p>
          </div>
        )}
      </div>
      <div className="feedback-section">
        <h2 className="section-title">Client Feedback</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="feedback-input"
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Type your feedback here..."
          />
          <button type="submit" className="submit-button">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;