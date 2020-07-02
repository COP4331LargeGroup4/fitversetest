const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('brcrypt');
const { json } = require('express');

// @route POST api/user/login
// @desc login user
// @access  Public
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = User.findOne({email});

		if(!user) throw Error('User does not exist');

		const match = await brcrypt.compare(password, user.password);
		if(!match) throw Error('Invalid credentials');

		res.status(200).json({
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
			}
		});
	} catch(e) {
		res.status(400).json({err : e.message});
	}
});

// @route POST api/user/signup
// @desc register user
// @access  Public
router.post('/signup', async (req, res) =>{
	const { firstName, lastName, email, password } = req.body;

	console.log(req.body);

	// Simple validation
	if (!firstName || !lastName || !email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	try {
		const user = await User.findOne({ email });
		if (user) throw Error('User already exists');

		const salt = await bcrypt.genSalt(10);
		if (!salt) throw Error('Bcrypt salt error');
		
		const hash = await bcrypt.hash(password, salt);
		if (!hash) throw Error('Bcrypt hash error');
		
		const newUser = new User({
			name,
			email,
			password: hash
		});

		const savedUser = await newUser.save();
		if (!savedUser) throw Error('Something went wrong saving the user');

		res.status(200).json({
			user: {
				id: savedUser._id,
				firstName: savedUser.firstName,
				lastName: savedUser.lastName,
			}
		});
	} catch(e) {
		res.status(400).json({err : e.message});
	}
});

// @route GET api/deleteAccount
// @desc delete account




module.exports = router;