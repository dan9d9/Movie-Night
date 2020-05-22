const axios = require('axios');
const serverURL = 'http://localhost:3000';
// /////////////////////
// /// HTTP REQUESTS ///
// /////////////////////
const httpRequests = {
	addMovie: async function(movieTitle, array) {
		try {
			const response = await axios.post(`${serverURL}/movies/new`, {
				title: movieTitle,
				array,
				approved: false
			});
			if(response.statusText === 'OK') {
				return response.data;	
			}
		}
		catch(err) {
			if(err.response) {
				console.log('error response: ', err.response);
			}else {
				console.log('error: ', err);	
			}
		}	
	}, 

	deleteMovie: async function(array, id) {
		try {
			const response = await axios.delete(`${serverURL}/movies/delete/${id}`);
			if(response.statusText === 'OK') {
				return response.data;	
			}
		}catch(err) {
			if(err.response) {
				console.log('error response: ', err.response);
			}else {
				console.log('error: ', err);	
			}
		}
	},

	getMovies: async function() {
		try {
			const response = await axios.get(`${serverURL}/movies`);
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

	approveMovie: async function(movie) {
		try {
			await axios.patch(`${serverURL}/movies/approve/${movie._id}`);
		}catch(err) {
			if(err.response) {
				console.log('error response: ', err.response);
			}else {
				console.log('error: ', err);	
			}
		}
	},

	updateMovie: async function(movie) {
		try {
			const response = await axios.put(`${serverURL}/movies/update`, {
				_id: movie._id,
				title: movie.title, 
				hasInfo: movie.hasInfo,
				summary: movie.summary,
				posterPath: movie.posterPath,
				videoPaths: movie.videoPaths
			});

			if(response.statusText === 'OK') {
				return response.data;	
			}
		}catch(err) {
			if(err.response) {
				console.log('error response: ', err.response);
			}else {
				console.log('error: ', err);	
			}
		}
	}
}

module.exports = httpRequests;