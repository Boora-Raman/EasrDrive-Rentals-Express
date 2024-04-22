const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    name: String,
    document: String,
    documentNumber: { type: String, unique: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
});

const Registration = mongoose.model('Registration', registrationSchema, 'registrations');

module.exports = Registration;
