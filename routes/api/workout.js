const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User model
const Workout = require('../../models/workout');
const jwtConfig = require('./Config/jwtConfig');


module.exports = router;