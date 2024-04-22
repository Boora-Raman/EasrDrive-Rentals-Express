const mongoose = require('mongoose');

const vehicleRegisterSchema = new mongoose.Schema({
    vehicleMake: String,
    vehicleModel: String,
    registrationNumber: { type: String, unique: true },
    userName: String,
    userEmail: { type: String, unique: true },
    location: String,
    phoneNumber: String,
    cost: Number,
    // Add other fields as needed
});

const VehicleRegister = mongoose.model('VehicleRegister', vehicleRegisterSchema);

module.exports = VehicleRegister;
