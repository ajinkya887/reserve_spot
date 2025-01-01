const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require("./routes/authRoutes")
const eventRoutes = require("./routes/eventRoutes")

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON requests

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DB_URI; // MongoDB URI in .env file

mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);