const axios = require('axios');
const { URL } = require('../config');

// /////////////////////
// /// HTTP REQUESTS ///
// /////////////////////
const httpRequests = {
  addMovie: async function (movieTitle, array) {
    try {
      const response = await axios.post(`${URL}/movies/new`, {
        title: movieTitle,
        array,
        approved: false,
      });
      if (response.statusText === 'OK') {
        return response.data;
      }
    } catch (err) {
      if (err.response) {
        console.log('error response: ', err.response);
      } else {
        console.log('error: ', err);
      }
    }
  },

  deleteMovie: async function (id) {
    try {
      const response = await axios.delete(`${URL}/movies/delete/${id}`);
      if (response.statusText === 'OK') {
        return response.data;
      }
    } catch (err) {
      if (err.response) {
        console.log('error response: ', err.response);
      } else {
        console.log('error: ', err);
      }
    }
  },

  getMovies: async function () {
    try {
      const response = await axios.get(`${URL}/movies`);
      if (response.statusText === 'OK') {
        return response.data;
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log(err);
      }
    }
  },

  approveMovie: async function (movie) {
    try {
      await axios.patch(`/movies/approve/${movie._id}`);
    } catch (err) {
      if (err.response) {
        console.log('error response: ', err.response);
      } else {
        console.log('error: ', err);
      }
    }
  },

  updateMovie: async function (movie) {
    try {
      const response = await axios.put(`${URL}/movies/update`, {
        _id: movie._id,
        title: movie.title,
        hasInfo: movie.hasInfo,
        summary: movie.summary,
        posterPath: movie.posterPath,
        videoPaths: movie.videoPaths,
      });

      if (response.statusText === 'OK') {
        return response.data;
      }
    } catch (err) {
      if (err.response) {
        console.log('error response: ', err.response);
      } else {
        console.log('error: ', err);
      }
    }
  },
};

module.exports = httpRequests;
