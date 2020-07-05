const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model
const Exercise = require('../../models/exercise');
const jwtConfig = require('./Config/jwtConfig');

// @route POST api/exercise/signup
// @desc Create exercise
// @access  Public
router.post('/create', async (req, res) => {
	const { token, name, sets, reps, weight, time, distance, isCardio, notes } = req.body;
	httpErr = 400;

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

					if ((sets || reps || weight) && (time || distance)) {
						throw Error('Conflicting strength and cardio information');
						httpErr = 400
					}

					var newExercise;
					if (isCardio) {
						newExercise = new Exercise({
							userId : authData._id,
							name,
							time,
							distance,
							isCardio,
							notes
						})
					} else {
						newExercise = new Exercise({
							name,
							sets,
							reps,
							weight,
							isCardio,
							notes
						})
					}

					const savedExercise = await newExercise.save();
					if (!savedExercise) {
						throw Error('Something went wrong saving the user');
						httpErr = 500;
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