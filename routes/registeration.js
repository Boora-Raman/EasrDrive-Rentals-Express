// Import necessary modules
const express = require('express');
const router = express.Router();
const Registration = require('./models/registrationModel');

// Handle POST request for form submission
router.post('/register', async (req, res) => {
  try {
    // Create a new Registration document using the data from the request body
    const registration = new Registration({
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      registrationNumber: req.body.registrationNumber,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
    });

    // Save the registration data to MongoDB
    await registration.save();

    // Respond with a success message
    res.send('Registration successful!');
  } catch (error) {
    // If an error occurs, respond with a 400 status code and the error message
    res.status(400).send(error);
  }
});

module.exports = router;

