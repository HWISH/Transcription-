import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import axios from 'axios';

function App() {
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcriptionText);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/feedback', {
        id: transcription.id,
        feedback,
      });

      setSubmittedFeedback(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transcription Service</h1>
        <FileUpload onFileUpload={handleFileUpload} />
        {transcription && (
          <div>
            <h2>Transcription</h2>
            <p>{transcription}</p>
            {!submittedFeedback && (
              <form onSubmit={handleFeedbackSubmit}>
                <label>
                  Feedback:
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </label>
                <button type="submit">Submit Feedback</button>
              </form>
            )}
            {submittedFeedback && <p>Thank you for your feedback!</p>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
