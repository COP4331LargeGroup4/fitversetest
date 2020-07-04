const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// Bodyparser Middleware
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

// Connect to mongo
mongoose
.connect(db, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err));

// Use Routes
const User = require('./routes/api/user')
const Workout = require('./routes/api/workout')
const Exercise = require('./routes/api/exercise')
app.use('/api/user', User);
app.use('/api/workout', Workout);
app.use('/api/exercise', Exercise);

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;