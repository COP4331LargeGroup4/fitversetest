const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express');


// User model
const User = require('../../models/user');
const jwtConfig = require('./Config/jwtConfig');

// @route POST api/user/login
// @desc login user
// @access  Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		User.findOne({ email: email },
			async function (err, user) {
				try {
					if (!user) throw Error('User does not exist');

					const match = await bcrypt.compare(password, user.password);
					if (!match) throw Error('Invalid credentials');

					jwt.sign({ _id: user._id }, jwtConfig.secretKey, { expiresIn: jwtConfig.timeout }, (err, token) => {
						res.status(200).json({
							token,

							user: {
								firstName: user.firstName,
								lastName: user.lastName,
							}
						});
					});
				} catch (e) {
					res.status(400).json({ err: e.message });
				}
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

	// Create User
	try {
		User.findOne({ email: email },
			async function (err, user) {
				try {
					if (user) throw Error('User already exists');

					const salt = await bcrypt.genSalt(10);
					if (!salt) throw Error('Bcrypt salt error');

					const hash = await bcrypt.hash(password, salt);
					if (!hash) throw Error('Bcrypt hash error');

					const newUser = new User({
						firstName,
						lastName,
						email,
						password: hash,
						emailVerified: false
					});

					const savedUser = await newUser.save();
					if (!savedUser) throw Error('Something went wrong saving the user');

					jwt.sign({ _id: savedUser._id }, jwtConfig.secretKey, { expiresIn: jwtConfig.timeout }, (err, token) => {
						res.status(200).json({
							token,

							user: {
								firstName: savedUser.firstName,
								lastName: savedUser.lastName,
							}
						});
					});

				} catch (e) {
					res.status(400).json({ err: e.message });
				}
			});
	} catch (e) {
		res.status(400).json({ err: e.message });
	}

	//TODO: Actually Send email
	jwt.sign({ email }, jwtConfig.secretKey, { expiresIn: jwtConfig.timeout }, (err, token) => {
		// Send the email using the token string
	});
});

// @route DELETE api/deleteAccount
// @desc delete account
router.post('/deleteAccount', async (req, res) => {
	const { password, token } = req.body;

	if (!token) {
		res.status(403).json();
	} else {
		jwt.verify(token, jwtConfig.secretKey, (err, authData) => {
			if (err) {
				if (err.name == "TokenExpiredError") {
					res.status(401).json()
				} else {
					res.status(403).json()
				}
			} else {
				try {
					User.findById(authData._id,
						async function (err, user) {
							try {
								if (!user) throw Error('User does not exist');

								const match = await bcrypt.compare(password, user.password);
								if (!match) throw Error('Invalid credentials');

								User.findByIdAndDelete(user._id,
									function (err) {
										res.status(200).json({
											msg: "user deleted"
										});
									});
							} catch (e) {
								res.status(400).json({ err: e.message });
							}
						});
				} catch (e) {
					res.status(400).json({ err: e.message });
				}
			}
		});
	}
});

module.exports = router;