const mongoose = require('mongoose');


const branchSchema = new mongoose.Schema({
     branchName: { type: String, required: true },
     branchId: { type: String, required: true, unique: true },
     branchSubjects: { type: [String], required: true }, // <- array of strings
     branchHead: { type: String, required: true }
}, {
     collection: 'branchDetails'

});


const branchDetails = mongoose.model('Branch', branchSchema);
module.exports = branchDetails;    