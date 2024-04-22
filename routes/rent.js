// Import the VehicleRegister model
const VehicleRegister = require('../models/VehicleRegister');

// Define the GET route for fetching filtered vehicle registrations
app.get('/vehicles', async (req, res) => {
    try {
        // Extract filters from the query parameters
        const { city, vehicleType } = req.body;

        // Construct the filter object based on the provided parameters
        const filter = {};
        if (city) filter.location = city;
        if (vehicleType) filter.vehicleType = vehicleType;

        // Query the database with the filter
        const filteredRegistrations = await VehicleRegister.find(filter);

        // Return the filtered registrations to the client
        res.json(filteredRegistrations);
    } catch (error) {
        // Handle errors
        console.error('Error fetching vehicle registrations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
