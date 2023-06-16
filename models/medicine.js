var mongoose = require("mongoose"),
	ObjectId = mongoose.Schema.Types.ObjectId;

var MedicineSchema = mongoose.Schema({
	description: String,
	tags: [ String ],
	owner : { type: ObjectId, ref: "User" }
});

var Med = mongoose.model("ToDo", MedicineSchema); 
module.exports = Med;