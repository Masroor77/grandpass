const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ServiceEntry = require('./models/ServiceEntry');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mobile_repair_shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// Get all service entries
app.get('/api/service-entries', async (req, res) => {
    try {
        const entries = await ServiceEntry.find().sort({ entryDate: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new service entry
app.post('/api/service-entries', async (req, res) => {
    const { customerName, customerMobile, mobileBrandModel, issueDescription, estimatedCharge, status } = req.body;

    // Generate Token Number (Simple Auto-generation: "T-" + Timestamp)
    // Ideally, we'd check for uniqueness and retry or use a counter.
    // For this simple app, timestamp is likely unique enough.
    const tokenNumber = req.body.tokenNumber || `T-${Date.now()}`;

    const entry = new ServiceEntry({
        tokenNumber,
        customerName,
        customerMobile,
        mobileBrandModel,
        issueDescription,
        estimatedCharge,
        status
    });

    try {
        const newEntry = await entry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a service entry
app.put('/api/service-entries/:id', async (req, res) => {
    try {
        const updatedEntry = await ServiceEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a service entry
app.delete('/api/service-entries/:id', async (req, res) => {
    try {
        await ServiceEntry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service entry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
