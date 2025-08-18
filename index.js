// We are making a crud application for student management...

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});


const studentRoutes = require('./Routes/studentRoutes.js');
const mongoURI = process.env.MONGODB_URI;

console.log("We are gonna try to connect to mongoDB :");
mongoose.connect(mongoURI, {
}).then(() => {
     console.log("Connected to MongoDB successfully✅");
}).catch((err) => {
     console.log("Error connecting to MongoDB❌", err);
});

app.use('/', studentRoutes);

