const express = require('express');
const router = express.Router();
const Registration = require('../models/signupModels');


router.get("/", async (req, res) => {
    try {
        const loggedIn = req.session.loggedIn;
        let message = '';

        if (loggedIn) {
            message = 'Logged in successfully!';
            const user = req.session.user; // Retrieve user information from session
            const username = user.username; // Assuming 'username' is a field in your user model
            res.render('index', { loggedIn, username, message });
        } else {
            message = 'You are logged out.';
            res.render('index', { loggedIn, username: 'Log in', message });
        }

        req.session.message = ""; // Clear the message after displaying it
    } catch (error) {
        console.error('Error rendering home page:', error.message);
        res.status(500).send('Internal Server Error: ' + error.message); // Send error message to client
    }
});



router.get("/rent", (req, res) => {
    const loggedIn = req.session.loggedIn;
    let message = '';
    if (loggedIn) {

        const user = req.session.user; // Retrieve user information from session
        const username = user.username; // Assuming 'username' is a field in your user model
        res.render('rent', { loggedIn, username, message });
        // res.render('rent', { loggedIn, message });

    } else {
        message = 'You are logged out.';
     res.render('rent', { loggedIn, message });

    }
    req.session.message = ""; // Clear the message after displaying it
});

router.get("/register", (req, res) => {

    const loggedIn = req.session.loggedIn;
    let message = '';
    if (loggedIn) {
   
        const user = req.session.user; // Retrieve user information from session
        const username = user.username; // Assuming 'username' is a field in your user model
        // res.render('register', { loggedIn, username, message });
        req.session.message = ""; // Clear the message after displaying it
        res.render('register', { loggedIn, username, message });

    } else {
        res.redirect('./')
        message = 'You are logged out.';
    }
});

router.get("/signup", (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { name, document, documentNumber, username, email, password } = req.body;
    try {
        const existingUserByEmail = await Registration.findOne({ email: email });
        const existingUserByDocNumber = await Registration.findOne({ documentNumber: documentNumber });

        if (existingUserByEmail) {
            return res.redirect('/signup?message=Email%20already%20exists');
        }
        if (existingUserByDocNumber) {
            return res.redirect('/signup?message=Account%20already%20created%20with%20this%20document%20number');
        }

        const newRegistration = new Registration({ name, document, documentNumber, username, email, password });
        await newRegistration.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error saving registration:', err.message);
        res.redirect('/signup');
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Registration.findOne({ email: email });

        if (!user || password != user.password) {
            return res.status(400).redirect('/login?message=Invalid%20credentials');
        }

        req.session.loggedIn = true;
        req.session.user = user; // Store user information in session
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).redirect('/login?message=Internal%20Server%20Error');
    }
});


router.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.message = "Logged out successfully!";
    res.redirect('/');
});

router.get('/login', (req, res) => {
    // req.session.loggedIn = false;
    // req.session.message = "Logged out successfully!";
    // res.redirect('/');
    res.render('login')
});

router.get('/signup', (req, res) => {
    // req.session.loggedIn = false;
    // req.session.message = "Logged out successfully!";
    // res.redirect('/');
    res.render('signup')
});

module.exports = router;
