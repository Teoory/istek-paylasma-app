const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const User = require ('./models/User');
const Suggestion = require ('./models/Suggestion');
const Settings = require ('./models/Settings');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const cookieParser = require ('cookie-parser');
const sesion = require ('express-session');
const ws = require ('ws');
const { connect } = require('http2');
const app = express ();
require ('dotenv').config ();

const createSecret = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let secret = '';
    for (let i = 0; i < length; i++) {
        secret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return secret;
};

const salt = bcrypt.genSaltSync(10);
const secret = createSecret(32);

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3030', 'https://teory-istek.vercel.app', 'https://istek-paylasma-api.vercel.app'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
};

app.use (cors (corsOptions));
app.use (express.json ());
app.use (cookieParser ());

app.use (sesion ({
    secret: createSecret(32),
    resave: false,
    saveUninitialized: true
}));

mongoose.connect (process.env.MONGODB_URL);

//? Register & Login
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userDoc = await User.create({
            email,
            username,
            password: bcrypt.hashSync(password, salt),
            role: 'user'
        });
        res.json({userDoc});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'User registration failed' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        return res.redirect('/login');
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({ username, password }, secret, {}, (err, token) => {
            if (err) {
                console.error('Error generating token:', err);
                return res.status(500).send('Error generating token');
            }

            res.cookie('token', token, { sameSite: "none", maxAge: 3600000, httpOnly: false, secure: true}).json({
                id: userDoc._id,
                username,
                role: userDoc.role
            });
            console.log('token:', token);
        });
    }else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.status(200).send('Logged out successfully');
});

//? Profile
app.get('/profile', (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ message: 'No token found' });
        }

        jwt.verify(token, secret, (err, info) => {
            if (err) {
                return res.clearCookie('token').status(401).json({ message: 'Unauthorized' });
            }
            
            res.json(info);
        });
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get('/profile/:username', async (req, res) => {
    const {username} = req.params;
    const userDoc = await User.findOne ({username})
    .select('-password')
    res.json(userDoc);
});

//? Note Post & Get
app.post('/suggestion', async (req, res) => {
    const { username, suggestion } = req.body;
    
    try {
        const newSuggestion = await Suggestion.create({ username, suggestion });
        res.json(newSuggestion);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.get('/preview', async (req, res) => {
    const suggestions = await Suggestion.find({ isApproved: false });
    res.json(suggestions);
});

app.put('/approve/:id', async (req, res) => {
    const { id } = req.params;
    const suggestion = await Suggestion.findById(id);

    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    suggestion.isApproved = true;
    await suggestion.save();
    res.json({ message: 'Suggestion approved' });
});

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const suggestion = await Suggestion.findById(id);

    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    await suggestion.deleteOne();
    res.json({ message: 'Suggestion deleted' });
});

app.post('/vote/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    const suggestion = await Suggestion.findById(id);
    if (!suggestion) return res.status(404).json({ message: 'Suggestion not found' });

    if (suggestion.voters.includes(username)) {
        // If already voted, remove vote
        suggestion.score -= 1;
        suggestion.voters = suggestion.voters.filter(voter => voter !== username);
    } else {
        // Add vote
        suggestion.score += 1;
        suggestion.voters.push(username);
    }

    await suggestion.save();
    res.json(suggestion);
});

app.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

app.post('/toggle-guest-suggestions', async (req, res) => {
    const settings = await Settings.findOne();
    settings.allowGuestSuggestions = !settings.allowGuestSuggestions;
    await settings.save();
    res.json(settings);
});

app.get('/suggestions', async (req, res) => {
    const suggestions = await Suggestion.find({ isApproved: true });
    res.json(suggestions);
});



//! Listen to port 3030
app.listen(3030, () => {
    console.log('Server listening on port 3030 || nodemon index.js')
});