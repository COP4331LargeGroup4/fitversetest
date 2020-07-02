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
		type: Array,
		required: true
	},
	weekly:{
		type: Int16Array,
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

module.exports = User = mongoose.model('workout', UserSchema);