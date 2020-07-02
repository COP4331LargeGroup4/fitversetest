const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const ExerciseSchema = new Schema({
	name:{
		type:String,
		required: true,
		unique: true
	},
	sets:{
		type: String
	},
	reps:{
		type: String
	},
	weight:{
		type: String
	},
	time:{
		type: String
	},
	distance:{
		type: String
	},
	notes:{
		type: String
	}
});

module.exports = User = mongoose.model('exercise', UserSchema);