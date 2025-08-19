const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
     studentName: { type: String, required: true },
     studentEmail: { type: String, required: true, unique: true },
     studentId: { type: String, required: true, unique: true },
     studentAge: { type: Number, required: true },
     studentClass: { type: String, required: true },
     studentBranch: { type: String, required: true }
}, {
     collection: 'studentDetails'
});

const studentDetails = mongoose.model('StudentDetails', studentSchema);

module.exports = studentDetails; 