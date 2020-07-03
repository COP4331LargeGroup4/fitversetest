const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const user = require('./routes/api/user')

const app = express();


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
app.use('/api/user', user);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
