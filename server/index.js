const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGOATLAS = process.env.MONGOATLAS;

// Middlewares
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//================ CORS ================================
const cors = require('cors');
app.use(cors());

// ROUTES
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/movies', require('./routes/movies_routes.js'));
app.use('/users', require('./routes/users_routes.js'));



async function connecting() {
	try {
	    await mongoose.connect(
	    	MONGOATLAS, 
	    { 
	      useUnifiedTopology: true , 
	      useNewUrlParser: true,
	      useFindAndModify: false
	    }),
	    console.log('Connected to the DB')
	} catch ( error ) {
	    console.log('ERROR: Seems like your DB is not running, please start it up!!!');
	}
}
connecting();


app.listen(PORT, () => console.log(`listening on port ${PORT}`));