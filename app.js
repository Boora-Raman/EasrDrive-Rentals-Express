const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
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

// Use routes
app.use('/', routes);
app.use('/', vehicleRoutes);

const port = process.env.PORT || 4500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
