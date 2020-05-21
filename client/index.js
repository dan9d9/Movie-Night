const APIKEY = 'ad4a44a2296a174ca3a693f429400547';
const imagePath = 'https://image.tmdb.org/t/p/w185';
const videoPath = 'https://www.youtube.com/embed';
const serverURL = 'http://localhost:3000';
const TMDBURL = 'https://api.themoviedb.org/3';

/////////////////////////////////
/// CREATE YOUTUBE PLAYER API
/// https://developers.google.com/youtube/iframe_api_reference
/////////////////////////////////
// 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      // height: '390',
      // width: '320',
      videoId: '',
      events: {
        'onReady': onPlayerReady
        // 'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  // var done = false;
  // function onPlayerStateChange(event) {
  //   if (event.data == YT.PlayerState.PLAYING && !done) {
  //     setTimeout(stopVideo, 6000);
  //     done = true;
  //   }
  // }
  // function stopVideo() {
  //   player.stopVideo();
  // }


//////////////
/// ARRAYS ///
//////////////
const movieArrays = {
	dannyArr: [],
	lolaArr: [],
	allMovies: [],
	searchedMovies: []
}


///////////////
/// HELPERS ///
///////////////
const helpers = {
	getArray: function(userUL) {
		if(userUL === 'listDanny') {
			return 'dannyArr';
		}else if(userUL === 'listLola') {
			return'lolaArr';
		}
	}
}

/////////////////////
/// HTTP REQUESTS ///
/////////////////////
const httpRequests = {
	addMovie: async function(movieTitle, array) {
		try {
			const response = await axios.post(`${serverURL}/movies/new`, {
				title: movieTitle,
				array,
				approved: false
			});
			console.log('post response: ', response);
			if(response.statusText === 'OK') {	
				movieList.addMovie(response.data);
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
			const response = await axios.delete(`${serverURL}/movies/${id}`);
			if(response.statusText === 'OK') {	
				movieList.deleteMovie(array, id);
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
			console.log('get response: ', response);
			if(response.statusText === 'OK') {
				movieArrays.allMovies = [...response.data];
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
			await axios.patch(`${serverURL}/movies/${movie._id}`);
		}catch(err) {
			if(err.response) {
				console.log('error response: ', err.response);
			}else {
				console.log('error: ', err);	
			}
		}
	},

	updateMovie: async function(movie, userUL) {
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
				handlers.closeModals();
				view.displayMovies(userUL);
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


//////////////////////////
/// TMDB API REQUESTS ///
//////////////////////////
const tmdbRequests = {
	getMovies: async function(query) {
		try {
			const response = await axios.get(`${TMDBURL}/search/movie?api_key=${APIKEY}&language=en-US&query=${query}&page=1&include_adult=false`);
			console.log('tmdb response: ', response);
			if(response.statusText === 'OK') {
				return movieArrays.searchedMovies = [...response.data.results];
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
			const response = await axios.get(`${TMDBURL}/movie/${id}?api_key=${APIKEY}&language=en-US`);
			console.log('tmdb response: ', response);
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
			const response = await axios.get(`${TMDBURL}/movie/${id}/videos?api_key=${APIKEY}&language=en-US`);
			console.log('tmdb movie response: ', response);
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


/////////////////////
/// ARRAY METHODS ///
/////////////////////
const movieList = {
	addMovie: function(movieData) {
		movieArrays[movieData.array].push(movieData);
	},

	deleteMovie: function(array, id) {
		let index = movieArrays[array].findIndex(ele => ele._id === id);
		movieArrays[array].splice(index, 1);
	},

	approveMovie: function(array, id) {
		let index = movieArrays[array].findIndex(ele => ele._id === id);
		const movie = movieArrays[array][index];

		movie.approved = !movie.approved;

		return movie;
	},
	
	updateMovie: function(movieToUpdate, movieDetails, videos) {
		let tempVids = videos.map(video => `${videoPath}/${video.key}`);
		let movieIdx = movieArrays[movieToUpdate.array].findIndex(ele => ele._id === movieToUpdate._id);

		movieToUpdate = {...movieToUpdate,
			title: movieDetails.title, 
			hasInfo: true,
			summary: movieDetails.overview,
			posterPath: `${imagePath}${movieDetails.poster_path}`,
			videoPaths: tempVids
		}

		movieArrays[movieToUpdate.array][movieIdx] = movieToUpdate;

		return movieToUpdate;
	}
}


////////////////
/// HANDLERS ///
////////////////
const handlers = {
	inputButtonClick: function() {
		const inputDanny = document.getElementById('inputDanny');
		const inputLola = document.getElementById('inputLola');
		let movieTitle;
		let array;
		let userUL;

		if(this.id === 'btnDanny') {
			movieTitle = inputDanny.value;
			userUL = document.getElementById('listDanny');
			array = 'dannyArr';
			inputDanny.value = '';
		} else if(this.id === 'btnLola') {
			movieTitle = inputLola.value;
			userUL = document.getElementById('listLola');
			array = 'lolaArr';
			inputLola.value = '';
		}

		httpRequests.addMovie(movieTitle, array).then(() => {
			view.displayMovies(userUL)
		});
	},

	inputPressEnter: function(e) {
		if(e.keyCode != 13) {return}
		
		const movieTitle = this.value;
		let array;
		let userUL;

		if(this.id === 'inputDanny') {
			userUL = document.getElementById('listDanny');
			array = 'dannyArr';
		} else if(this.id === 'inputLola') {
			userUL = document.getElementById('listLola');
			array = 'lolaArr';
		}

		this.value = '';

		httpRequests.addMovie(movieTitle, array).then(() => {
			view.displayMovies(userUL);
		});
	},

	listButtonsHandler: function(e) {
		if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'LI') {return}

		const id = e.target.parentNode.dataset.id;
		const userUL = this;
		let array = helpers.getArray(this.id);

		if(e.target.tagName === 'LI') {
			if(e.target.dataset.movie_info === 'false') {
				handlers.openMovieModal(e.target)
			}else if(e.target.dataset.movie_info === 'true') {
				handlers.openTrailerModal(array, e.target.dataset.id);
			}
		}

		if(e.target.className === 'btnDelete') {
			httpRequests.deleteMovie(array, id).then(() => {
				view.displayMovies(userUL);
			});
			
		}else if(e.target.className === 'btnApprove' || e.target.className === 'btnApprove js-approve') {
			let movieApproved = movieList.approveMovie(array, id);
			httpRequests.approveMovie(movieApproved).then(() => {
				view.displayMovies(userUL);	
			});	
		}
	},

	openMovieModal: function(target) {
		const movieModal = document.getElementById('movie_modal');
		const movieId = target.dataset.id;

		let array = helpers.getArray(target.parentNode.id);
		
		const movieTitle = movieArrays[array].find(ele => ele._id === movieId).title;

		movieModal.style.display = 'block';
		movieModal.addEventListener('click', handlers.handleModals.bind(target));

		tmdbRequests.getMovies(movieTitle).then(() => {
			view.displayMovieResults(movieArrays.searchedMovies);
		});
	},

	handleModals: function(e) {
		if(e.target.className === 'close_modal' || e.target.className === 'close_modal-span') {
			handlers.closeModals();
		}else if(e.target.dataset.movie_id) {
			handlers.chooseMovie(e.target.dataset.movie_id, this);
		}
	},

	closeModals: function() {
		const movieModal = document.getElementById('movie_modal');
		const trailerModal = document.getElementById('trailer_modal');

		movieModal.removeEventListener('click', handlers.handleModals.bind());
		trailerModal.removeEventListener('click', handlers.handleModals);

		movieArrays.searchedMovies = [];
		document.getElementById('player').src = "";
		movieModal.style.display = 'none';
		trailerModal.style.display = 'none';
	},

	chooseMovie: function(movieID, listItem) {
		let array = helpers.getArray(listItem.parentNode.id);

		const movieToUpdate = movieArrays[array].find(movie => movie._id === listItem.dataset.id);

		tmdbRequests.getMovieDetails(movieID).then(details => {
			tmdbRequests.getMovieVideos(details.id).then(videos => {
				listItem.dataset.movie_info = 'true';
				const updatedMovie = movieList.updateMovie(movieToUpdate, details, videos.results);
				httpRequests.updateMovie(updatedMovie, listItem.parentNode);
			});
		});
	},

	openTrailerModal: function(array, movieID) {
		const trailerModal = document.getElementById('trailer_modal');
		trailerModal.addEventListener('click', handlers.handleModals);

		const movie = movieArrays[array].find(movie => movie._id === movieID);

		console.log(movie);
		trailer_modal.style.display = 'block';
		document.getElementById('player').src = movie.videoPaths[0];
	}
}

////////////
/// VIEW ///
////////////
const view = {
	displayMovies: function(userUL) {
		let array = helpers.getArray(userUL.id);

		console.log('display movies ul: ', userUL);
		console.log('display movies array: ', movieArrays[array]);

		userUL.innerHTML = movieArrays[array].map(movie => {
			let hasInfo;
			movie.hasInfo ? hasInfo = 'true' : hasInfo = 'false';

			return `
				<li class='itemClass' data-movie_info=${hasInfo} data-id=${movie._id}>
					${movie.title}
					<button class='btnApprove'>\u2713</button>
					<button class='btnDelete'>\u2717</button>
				</li>
			`;
		}).join('');

		view.displayApproved(userUL);
	},

	displayApproved: function(userUL) {
		let array = helpers.getArray(userUL.id);

		movieArrays[array].forEach((movie, index) => {
			if(movie.approved) {
				const movieLiToApprove = userUL.querySelector(`li[data-id='${movie._id}']`);
				const movieButtonToApprove = movieLiToApprove.children[0];

				movieLiToApprove.classList.toggle('js-approve');
				movieButtonToApprove.classList.toggle('js-approve');
			}	
		});
	},

	displayMovieResults: function(movieArray) {
		const movieList = document.getElementById('movie_modal-list');
		if(movieArray.length === 0) {
			return movieList.innerHTML = `<li>No results for that search</li>`;
		}

		movieList.innerHTML = movieArray.map(movie => {
			let posterPath;
			movie.poster_path ? posterPath = imagePath + movie.poster_path : posterPath = '';

			let date;
			movie.release_date ? date = movie.release_date.split('-')[0] : date = '';

			return `
				<li class='movie_modal-movie'>
					<img src='${posterPath}' alt='missing movie poster'/>
					<div>
						<p>${movie.title} - ${date}</p>
						<p>${movie.overview}</p>
					</div>
					<button data-movie_id=${movie.id}>Choose</button>
				</li>
			`
		}).join('');
	}
}


///////////////////////
/// EVENT LISTENERS ///
///////////////////////
const events = {
	listeners: function() {
		const inputButtons = document.querySelectorAll('.btnContainer button');
		const inputs = Array.from(document.getElementsByClassName('input'));
		const usersUL = document.querySelectorAll('ul');

		inputButtons.forEach(btn => btn.addEventListener('click', handlers.inputButtonClick));
		inputs.forEach(input => input.addEventListener('keypress', handlers.inputPressEnter));
		usersUL.forEach(ul => ul.addEventListener('click', handlers.listButtonsHandler));
	}	
}


///////////////
/// ON LOAD ///
///////////////
window.onload = function() {
	httpRequests.getMovies()
		.then(() => {
			movieArrays.dannyArr = movieArrays.allMovies.filter(movie => movie.array === 'dannyArr');
			movieArrays.lolaArr = movieArrays.allMovies.filter(movie => movie.array === 'lolaArr');
			view.displayMovies(document.getElementById('listDanny'));
			view.displayMovies(document.getElementById('listLola'));
			events.listeners();
		});
}
	