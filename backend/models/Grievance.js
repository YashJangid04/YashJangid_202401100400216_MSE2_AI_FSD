const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Academic', 'Hostel', 'Transport', 'Other']
    },
    date: { type: Date, default: Date.now },
    status: { 
        type: String, 
        default: 'Pending',
        enum: ['Pending', 'Resolved']
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
