const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model
const Workout = require('../../models/workout');
const Exercise = require('../../models/exercise');
const jwtConfig = require('./Config/jwtConfig');
const { promise } = require('bcrypt/promises');

// @route POST api/workout/create
// @desc Create workout
// @access  Public
router.post('/create', async (req, res) => {
	const { token, name, exercises, weekly, startDate, endDate, notes } = req.body;

	httpErr = 500;
	if (!token) {
		res.status(403).json();
	} else {
		jwt.verify(token, jwtConfig.secretKey, async (err, authData) => {
			if (err) {
				if (err.name == "TokenExpiredError") {
					res.status(401).json()
				} else {
					res.status(403).json()
				}
			} else {

				try {
					// Verify request
					if (!name || !exercises || !weekly || !startDate) {
						httpErr = 400;
						throw Error('Missing required fields');
					}
					if (weekly.length != 7) {
						httpErr = 400;
						throw Error('There are 7 days in a week');
					}


					var newWorkout = new Workout({
						userId: authData._id,
						name,
						exercises,
						weekly,
						startDate,
						endDate,
						notes
					})

					const savedExercise = await newWorkout.save();
					if (!savedExercise) {
						httpErr = 500;
						throw Error('Something went wrong saving the user');
					}

					res.status(201).json()

				} catch (e) {
					res.status(httpErr).json({ err: e.message });
				}
			}
		});
	}
});

// @route POST api/workout/read
// @desc Read single workout by ID
// @access  Public
router.post('/read', async (req, res) => {
	const { token, id } = req.body;

	httpErr = 500;
	if (!token) {
		res.status(403).json();
	} else {
		jwt.verify(token, jwtConfig.secretKey, async (err, authData) => {
			if (err) {
				if (err.name == "TokenExpiredError") {
					res.status(401).json()
				} else {
					res.status(403).json()
				}
			} else {

				try {
					// Verify request
					if (!id) {
						httpErr = 400
						throw Error('No id');
					}


					const workout = await Workout.findById(id);

					// Auth
					if (!workout) {
						httpErr = 404
						throw Error('Nonexistent Workout')
					}
					if (workout.userId != authData._id) {
						httpErr = 403;
						throw Error('Invalid credentials')
					}

					var retWorkout = {
						name: workout.name,
						weekly: workout.weekly,
						startDate: workout.startDate,
						endDate: workout.endDate
					}

					var exercises =
						workout.exercises.map(async (exId) => {
							var exercise = await Exercise.findById(exId);
							return exercise;
						});
					Promise.all(exercises).then(result => {
						retWorkout['exercises'] = result;
						res.status(200).json({ workout: retWorkout });
					});

				} catch (e) {
					res.status(httpErr).json({ err: e.message });
				}
			}
		});
	}
});

// @route POST api/workout/readAll
// @desc Get all workouts
// @access  Public
router.post('/readAll', async (req, res) => {
	const { token } = req.body;

	httpErr = 500;
	if (!token) {
		res.status(403).json();
	} else {
		jwt.verify(token, jwtConfig.secretKey, async (err, authData) => {
			if (err) {
				if (err.name == "TokenExpiredError") {
					res.status(401).json()
				} else {
					res.status(403).json()
				}
			} else {

				try {
					const workouts = await Workout.find({ userId: authData._id });

					// Cursed Code don't touch don't replicate
					var retWorkouts =
						workouts.map((workout) => {
							var retWorkout = {
								name: workout.name,
								weekly: workout.weekly,
								startDate: workout.startDate,
								endDate: workout.endDate
							}

							var exercises =
								workout.exercises.map(async (exId) => {
									var exercise = await Exercise.findById(exId);
									return exercise;
								});
							var promises =
								Promise.all(exercises).then(result => {
									retWorkout['exercises'] = result;
									return retWorkout;
								});

							return promises
						});
					Promise.all(retWorkouts).then(result => {
						res.status(200).json({ workouts: result });
					});
				} catch (e) {
					res.status(httpErr).json({ err: e.message });
				}
			}
		});
	}
});

// @route POST api/exercise/update
// @desc Update single exercise by ID
// @access  Public
router.post('/update', async (req, res) => {
	const { token, id } = req.body;
	const { name, removeExercises, addExercises, weekly, startDate, endDate, notes } = req.body;

	httpErr = 500;
	if (!token) {
		res.status(403).json();
	} else {
		jwt.verify(token, jwtConfig.secretKey, async (err, authData) => {
			if (err) {
				if (err.name == "TokenExpiredError") {
					res.status(401).json();
				} else {
					res.status(403).json();
				}
			} else {

				try {
					if (!id) {
						httpErr = 400
						throw Error('No id');
					}

					const exercise = await Exercise.findById(id);

					if (!exercise) {
						httpErr = 404
						throw Error('Nonexistent Exercise');
					}

					if (exercise.userId != authData._id) {
						httpErr = 403;
						throw Error('Invalid credentials');
					}

					Exercise.findByIdAndUpdate(id,
						{
							name, sets, reps, weight, time, distance, isCardio, notes
						},
						function (err) {
							res.status(200).json();
						});
				} catch (e) {
					res.status(httpErr).json({ err: e.message });
				}
			}
		});

});

module.exports = router;