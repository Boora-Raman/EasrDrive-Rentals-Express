const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mongoose connection
mongoose.connect('mongodb+srv://booraraman2004:ramanBoora@cluster0.xaz6fpx.mongodb.net/RentalData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  document: String,
  documentNumber: { type: String, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true }, // Ensure email uniqueness
  password: String
});

// Hash password before saving
registrationSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

const Registration = mongoose.model('Registration', registrationSchema, 'registrations');

// Login schema
const loginSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Login = mongoose.model('Login', loginSchema, 'logins');

// Routes
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/login", (req, res) => {
    res.render('login', { message: req.query.message });
});

app.get("/signup", (req, res) => {
    res.render('signup', { message: req.query.message });
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/rent", (req, res) => {
    res.render('rent');
});

app.post('/signup', async (req, res) => {
  const { name, document, documentNumber, username, email, password } = req.body;
  try {
    // Check if email already exists
    const existingUserByEmail = await Registration.findOne({ email: email });
    const existingUserByDocNumber = await Registration.findOne({ documentNumber: documentNumber });
    if (existingUserByEmail) {
      // If email already exists, redirect back to signup page with an error message
      return res.redirect('/signup?message=Email%20already%20exists');
    }
    if (existingUserByDocNumber) {
      // If document number already exists, redirect back to signup page with an error message
      return res.redirect('/signup?message=Account%20already%20created%20with%20this%20document%20number');
    }
    
    const newRegistration = new Registration({ name, document, documentNumber, username, email, password });
    await newRegistration.save();
    res.redirect('/login?message=Account%20created%20successfully.%20You%20can%20now%20login.');
  } catch (err) {
    console.error('Error saving registration:', err.message);
    res.redirect('/signup');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Login.findOne({ username: username });
    if (!user) {
      // If user does not exist, redirect back to login page with an error message
      return res.redirect('/login?message=Invalid%20credentials');
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      // If password is valid, redirect to dashboard with a welcome message
      return res.render('dashboard', { username: username });
    } else {
      // If password is invalid, redirect back to login page with an error message
      return res.redirect('/login?message=Invalid%20credentials');
    }
  } catch (err) {
    console.error('Error during login:', err.message);
    res.redirect('/login');
  }
});

const port = process.env.PORT || 4500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
