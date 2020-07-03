const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { json } = require('express');


// User model
const User = require('../../models/user');

// @route POST api/user/login
// @desc login user
// @access  Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		User.findOne({ email: email },
			function (err, user) {
				if (!user) throw Error('User does not exist');

				try {
					const match = bcrypt.compare(password, user.password);
					if (!match) throw Error('Invalid credentials');
				} catch (e) {
					res.status(400).json({ err: e.message });
				}

				res.status(200).json({
					user: {
						id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
					}
				});
			});
	} catch (e) {
		res.status(400).json({ err: e.message });
	}
});

// @route POST api/user/signup
// @desc register user
// @access  Public
router.post('/signup', async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	// Simple validation
	if (!firstName || !lastName || !email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	try {
		User.findOne({ email: email },
			function (err, user) {
				try {
					if (user) throw Error('User already exists');

					const salt = bcrypt.genSalt(10);
					if (!salt) throw Error('Bcrypt salt error');

					const hash = bcrypt.hash(password, salt);
					if (!hash) throw Error('Bcrypt hash error');

					const newUser = new User({
						firstName,
						lastName,
						email,
						password: hash
					});

					const savedUser = newUser.save();
					if (!savedUser) throw Error('Something went wrong saving the user');

					res.status(200).json({
						user: {
							id: savedUser._id,
							firstName: savedUser.firstName,
							lastName: savedUser.lastName,
						}
					});
				} catch (e) {
					res.status(400).json({ err: e.message });
				}
			});
	} catch (e) {
		res.status(400).json({ err: e.message });
	}
});

// @route DELETE api/deleteAccount
// @desc delete account
router.post('/deleteAccount', async (req, res) => {
	const { email, password } = req.body;

	try {
		User.findOne({ email: email },
			async function (err, user) {
				if (!user) throw Error('User does not exist');

				try {
					const match = await bcrypt.compare(password, user.password);
					if (!match) throw Error('Invalid credentials');
				} catch (e) {
					res.status(400).json({ err: e.message });
				}


				User.find
				res.status(200).json({
					user: {
						id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
					}
				});
			});
	} catch (e) {
		res.status(400).json({ err: e.message });
	}
});

module.exports = router;