const express = require('express');
const router = express.Router();
const VehicleRegister = require('../models/VehicleRegister');

router.post('/registervehicle', async (req, res) => {
    const { vehicleMake, vehicleModel, registrationNumber, userName, userEmail, location, phoneNumber, cost } = req.body;
    try {
        const existingVehicle = await VehicleRegister.findOne({ registrationNumber: registrationNumber });
        if (existingVehicle) {
            return res.redirect('/register?message=Vehicle%20already%20registered%20with%20this%20registration%20number');
        }

        const newVehicle = new VehicleRegister({ vehicleMake, vehicleModel, registrationNumber, userName, userEmail, location, phoneNumber, cost });
        await newVehicle.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error saving vehicle registration:', err.message);
        res.redirect('/register');
    }
});

module.exports = router;
