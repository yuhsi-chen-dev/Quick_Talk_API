const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// init environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// init routes
app.get('/', (req, res) => {
  res.send('QuickTalk API is running ✅');
});

// run server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});