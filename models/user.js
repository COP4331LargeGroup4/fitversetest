const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const UserSchema = new Schema({
	email:{
		type: String,
		required: true,
		unique: true
	},
	firstName:{
		type: String,
		required: true
	},
	lastName:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
});

module.exports = User = mongoose.model('user', UserSchema);