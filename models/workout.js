const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const WorkoutSchema = new Schema({
	userId: {
		type:String,
		required: true
	},
	name:{
		type:String,
		required: true,
	},
	exercises:{
		type: [String],
		required: true,
		default: []
	},
	weekly:{
		type: [Number],
		required: true
	},
	startDate:{
		type : Date,
		required : true
	},
	endDate:{
		type : Date,
	},
	notes:{
		type: String
	}
});

module.exports = Workout = mongoose.model('workout', WorkoutSchema);