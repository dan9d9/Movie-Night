const axios = require('axios');
const KEY = require('./apiKey');
const TMDBURL = 'https://api.themoviedb.org/3';

//////////////////////////
/// TMDB API REQUESTS ///
//////////////////////////
const tmdbRequests = {
	getMovies: async function(query) {
		try {
			const response = await axios.get(`${TMDBURL}/search/movie?api_key=${KEY}&language=en-US&query=${query}&page=1&include_adult=false`);
			if(response.statusText === 'OK') {
				return response.data.results;
			}
		}catch(err) {
			if(err.response) {
				console.log(err.response);
			}else {
				console.log(err);	
			}
		}
	},

	getMovieDetails: async function(id) {
		try {
			const response = await axios.get(`${TMDBURL}/movie/${id}?api_key=${KEY}&language=en-US`);
			if(response.statusText === 'OK') {
				return response.data;
			}
		}catch(err) {
			if(err.response) {
				console.log(err.response);
			}else {
				console.log(err);	
			}
		}
	},

	getMovieVideos: async function(id) {
		try {
			const response = await axios.get(`${TMDBURL}/movie/${id}/videos?api_key=${KEY}&language=en-US`);
			if(response.statusText === 'OK') {
				return response.data;
			}
		}catch(err) {
			if(err.response) {
				console.log(err.response);
			}else {
				console.log(err);	
			}
		}
	}
}

module.exports = tmdbRequests;