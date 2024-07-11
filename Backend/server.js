const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/transcriptions', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema for transcriptions
const transcriptionSchema = new mongoose.Schema({
    audioFilePath: String,
    transcriptionText: String,
    feedback: String
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);

// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });

// POST endpoint for uploading audio file and getting transcription
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('audio_file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        const pythonApiUrl = 'http://localhost:5001/api/transcribe';
        const response = await axios.post(pythonApiUrl, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const { transcription } = response.data;

        const newTranscription = new Transcription({
            audioFilePath: req.file.path,
            transcriptionText: transcription,
            feedback: ''
        });

        await newTranscription.save();

        res.json(newTranscription);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
});

// POST endpoint for submitting feedback on transcriptions
app.post('/api/feedback', async (req, res) => {
    try {
        const { id, feedback } = req.body;

        const updatedTranscription = await Transcription.findByIdAndUpdate(id, { feedback }, { new: true });

        res.json(updatedTranscription);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update transcription feedback' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
