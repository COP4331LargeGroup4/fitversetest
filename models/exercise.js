const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const ExerciseSchema = new Schema({
	userId: {
		type:String,
		required: true
	},
	name: {
		type: String,
		required: true,
	},
	sets: {
		type: String
	},
	reps: {
		type: String
	},
	weight: {
		type: String
	},
	time: {
		type: String
	},
	distance: {
		type: String
	},
	isCardio: {
		type: Boolean,
		required: true
	},
	notes: {
		type: String
	}
});

module.exports = Exercise = mongoose.model('exercise', ExerciseSchema);