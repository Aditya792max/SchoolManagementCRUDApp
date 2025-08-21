const mongoose = require('mongoose');
const scoreSchema = new mongoose.Schema({
     studentName: { type: String, required: true },
     studentId: { type: String, required: true, unique: true },
     branchId: { type: String, required: true }, // removed unique
     scoreStatus: { type: String, required: true },
     branchScores: { type: [Number], required: true } // or [{ subject, score }]
}, {
     collection: 'scoreDetails'
});

module.exports = mongoose.model('scoreDetails', scoreSchema);