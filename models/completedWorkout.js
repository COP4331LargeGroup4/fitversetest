const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const CompletedWorkoutSchema = new Schema({
	name:{
		type:String,
		required: true,
		unique: true
	},
	exercises:{
		type: Array	
	},
	date:{
		type : String
	},
	notes:{
		type: String
	}
});

module.exports = CompletedWorkout = mongoose.model('completedWorkout', CompletedWorkoutSchema);