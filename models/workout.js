const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const WorkoutSchema = new Schema({
	name:{
		type:String,
		required: true,
		unique: true
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
		type : String,
		required : true
	},
	endDate:{
		type : String,
	},
	notes:{
		type: String
	}
});

module.exports = Workout = mongoose.model('workout', WorkoutSchema);