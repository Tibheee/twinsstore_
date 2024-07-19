// Menggunakan Express dan bcrypt untuk otentikasi email
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Skema pengguna
const userSchema = new mongoose.Schema({
    googleId: String,
    facebookId: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(session({ 
    secret: 'secret', 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
            done(null, existingUser);
        } else {
            new User({
                googleId: profile.id,
                email: profile.emails[0].value,
            }).save().then(user => done(null, user));
        }
    });
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: 'YOUR_FACEBOOK_APP_ID',
    clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id }).then(existingUser => {
        if (existingUser) {
            done(null, existingUser);
        } else {
            new User({
                facebookId: profile.id,
                email: profile.emails[0].value,
            }).save().then(user => done(null, user));
        }
    });
}));

// Routes
app.get('/', (req, res) => {
    res.send(`
        <h1>Home</h1>
        <a href="/auth/google">Login with Google</a><br>
        <a href="/auth/facebook">Login with Facebook</a>
    `);
});

// Google Auth Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/'); // Redirect to home on success
});

// Facebook Auth Routes
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/'); // Redirect to home on success
});

// Endpoint untuk permintaan penghapusan data
app.post('/request-data-deletion', (req, res) => {
    const userId = req.body.userId; // Ambil ID pengguna dari permintaan

    // Logika untuk menghapus data pengguna dari database
    User.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).send({ message: 'Data berhasil dihapus.' });
        })
        .catch(err => {
            res.status(500).send({ message: 'Terjadi kesalahan saat menghapus data.', error: err });
        });
});

// Rute untuk menyajikan halaman petunjuk penghapusan data
app.get('/data-deletion-instructions', (req, res) => {
    res.sendFile(path.join(__dirname, 'data-deletion-instructions.html'));
});

// Sertifikat SSL
const options = {
    key: fs.readFileSync('path/to/your/private.key'),
    cert: fs.readFileSync('path/to/your/certificate.crt')
};

// Membuat server HTTPS
const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT}`);
});