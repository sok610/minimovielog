const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express()
require('dotenv').config();

// Connect with DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// Set Up
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Routing
app.get('/', (req, res) => {
    res.redirect('/movies');
});

// /movies' routers
const movieRoutes = require('./routes/movies');
app.use('/movies', movieRoutes);



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});