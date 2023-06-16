var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
	username: String,
	id: String
});

let User = mongoose.model("User", UserSchema);

module.exports = User;