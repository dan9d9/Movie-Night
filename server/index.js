const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const app = express();
const { MONGOATLAS } = require('./config');
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//================ CORS ================================
const cors = require('cors');
app.use(cors());

// ROUTES
app.use(express.static(path.join(__dirname, '../client/public')));
app.use('/movies', require('./routes/movies_routes.js'));
app.use('/users', require('./routes/users_routes.js'));

async function connectDB() {
  try {
    await mongoose.connect(MONGOATLAS, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    console.log('Connected to the DB');
  } catch (error) {
    console.log(error);
    console.log("ERROR: Couldn't connect to the DB!");
  }
}
connectDB();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
