const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const auth = require('../middleware/auth');

// @route   POST /api/grievances
// @desc    Submit grievance
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newGrievance = new Grievance({
            title,
            description,
            category,
            user: req.user.id
        });
        const grievance = await newGrievance.save();
        res.json(grievance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/grievances
// @desc    View all grievances for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const grievances = await Grievance.find({ user: req.user.id }).sort({ date: -1 });
        res.json(grievances);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/grievances/search?title=xyz
// @desc    Search grievance by title
router.get('/search', auth, async (req, res) => {
    try {
        const { title } = req.query;
        const grievances = await Grievance.find({ 
            user: req.user.id,
            title: { $regex: title, $options: 'i' } 
        });
        res.json(grievances);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/grievances/:id
// @desc    View grievance by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const grievance = await Grievance.findById(req.params.id);
        if (!grievance || grievance.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Grievance not found' });
        }
        res.json(grievance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/grievances/:id
// @desc    Update grievance
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, category, status } = req.body;
        let grievance = await Grievance.findById(req.params.id);
        
        if (!grievance || grievance.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        grievance = await Grievance.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, category, status } },
            { new: true }
        );
        res.json(grievance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/grievances/:id
// @desc    Delete grievance
router.delete('/:id', auth, async (req, res) => {
    try {
        const grievance = await Grievance.findById(req.params.id);
        if (!grievance || grievance.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        await Grievance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Grievance removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
