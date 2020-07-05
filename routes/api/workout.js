const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model
const Workout = require('../../models/workout');
const jwtConfig = require('./Config/jwtConfig');

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

					if (!name || !exercises || !weekly || !startDate) {
						httpErr = 400;
						throw Error('Missing required fields');
					}

					var newExercise = new Exercise({
						userId: authData._id,
						name,
						exercises,
						weekly,
						startDate,
						endDate,
						notes
					})

					const savedExercise = await newExercise.save();
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


module.exports = router;