require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || 'dummy-api-key';
const genAI = new GoogleGenerativeAI(apiKey);

module.exports = genAI;
