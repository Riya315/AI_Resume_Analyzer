// Vercel Serverless Function entry point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], credentials: true }));
app.use(express.json());

// Import routes
const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);

// Health check
app.get('/', (req, res) => res.send('AI Resume Analyzer API is running'));

module.exports = app;
