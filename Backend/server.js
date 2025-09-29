const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require("./config/database")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDb()

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/destinations', require('./routes/destinationRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'TravelPath API is running!' });
});


app.use((req,res)=>{
  return res.status(404).json({message:"page not found"})
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
