const myAPI = require('./myAPI');
const tmdbAPI = require('./tmdbAPI');
const imagePath = 'https://image.tmdb.org/t/p/w185';
const videoPath = 'https://www.youtube.com/embed';


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
/// ARRAY METHODS ///
/////////////////////
const movieList = {
	addMovie: function(movieData) {
		movieArrays[movieData.array].push(movieData);
	},

	deleteMovie: function(array, id) {
		const index = movieArrays[array].findIndex(ele => ele._id === id);

		movieArrays[array].splice(index, 1);
	},

	approveMovie: function(array, id) {
		const movie = movieArrays[array].find(ele => ele._id === id);

		movie.approved = !movie.approved;

		return movie;
	},
	
	updateMovie: function(movieToUpdate, movieDetails, videos) {
		const tempVids = videos.map(video => `${videoPath}/${video.key}`);
		const movieIdx = movieArrays[movieToUpdate.array].findIndex(ele => ele._id === movieToUpdate._id);

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
		let movieTitle, array, userUL, input;

		if(this.id === 'btnDanny') {
      input = document.getElementById('inputDanny');
			movieTitle = inputDanny.value.trim();
			userUL = document.getElementById('listDanny');
			array = 'dannyArr';
		} else if(this.id === 'btnLola') {
      input = document.getElementById('inputLola');
			movieTitle = inputLola.value.trim();
			userUL = document.getElementById('listLola');
			array = 'lolaArr';
    }

    if(!movieTitle) {return input.placeholder = 'Please enter a valid movie title'};
    input.value = '';
    input.placeholder = 'Enter a movie';

		myAPI.addMovie(movieTitle, array).then(response => {
			movieList.addMovie(response);
			view.displayMovies(userUL)
		});
	},

	inputPressEnter: function(e) {
		if(e.keyCode !== 13) {return};
    
		const movieTitle = this.value.trim();
    if(!movieTitle) {return this.placeholder = 'Please enter a valid movie title'};

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
    this.placeholder = 'Enter a movie';

		myAPI.addMovie(movieTitle, array).then(response => {
			movieList.addMovie(response);
			view.displayMovies(userUL);
		});
	},

	listButtonsHandler: function(e) {
		if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'LI') {return}

		const id = e.target.parentNode.dataset.id;
		const userUL = this;
		const array = helpers.getArray(this.id);

		if(e.target.tagName === 'LI') {
			if(e.target.dataset.movie_info === 'false') {
				handlers.openMovieModal(e.target)
			}else if(e.target.dataset.movie_info === 'true') {
				handlers.openTrailerModal(array, e.target.dataset.id);
			}
		}else if(e.target.className === 'btnDelete') {
			myAPI.deleteMovie(array, id).then(() => {
				movieList.deleteMovie(array, id);
				view.displayMovies(userUL);
			});	
		}else if(e.target.className === 'btnApprove' || e.target.className === 'btnApprove js-approve') {
			let movieApproved = movieList.approveMovie(array, id);
			myAPI.approveMovie(movieApproved).then(() => {
				view.displayMovies(userUL);	
			});	
		}
	},

	openMovieModal: function(target) {
		const movieModal = document.getElementById('movie_modal');
		const movieId = target.dataset.id;
		const array = helpers.getArray(target.parentNode.id);	
		const movieTitle = movieArrays[array].find(ele => ele._id === movieId).title;

		movieModal.style.display = 'block';

		// Bound function in event listener creates separate reference each time
		// Create new property on handlers as a stable reference for removeEventHandler
		handlers.tempHandleModals = handlers.handleModals.bind(target);
		movieModal.addEventListener('click', handlers.tempHandleModals);

		tmdbAPI.getMovies(movieTitle).then(movieResults => {
			movieArrays.searchedMovies = [...movieResults];
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
		const innerTrailer = document.getElementById('movie_trailer-inner');
		const h2 = innerTrailer.querySelector('h2');
		const youtubePlayer = document.getElementById('player');

		movieModal.removeEventListener('click', handlers.tempHandleModals);
		trailerModal.removeEventListener('click', handlers.handleModals);

		if(h2) {innerTrailer.removeChild(h2)};
		movieArrays.searchedMovies = [];
		youtubePlayer.style.display = 'inline-block';
		youtubePlayer.src = "";
		movieModal.style.display = 'none';
		trailerModal.style.display = 'none';
	},

	chooseMovie: function(movieID, listItem) {
		const array = helpers.getArray(listItem.parentNode.id);
		const movieToUpdate = movieArrays[array].find(movie => movie._id === listItem.dataset.id);

		tmdbAPI.getMovieDetails(movieID).then(details => {
			tmdbAPI.getMovieVideos(details.id).then(videos => {
				const updatedMovie = movieList.updateMovie(movieToUpdate, details, videos.results);

				listItem.dataset.movie_info = 'true';
				myAPI.updateMovie(updatedMovie).then(response => {
					handlers.closeModals();
					view.displayMovies(listItem.parentNode);
				});
			});
		});
	},

	openTrailerModal: function(array, movieID) {
		const trailerModal = document.getElementById('trailer_modal');
		const innerTrailer = document.getElementById('movie_trailer-inner');
		const youtubePlayer = document.getElementById('player');

		trailerModal.addEventListener('click', handlers.handleModals);
		trailer_modal.style.display = 'flex';

		const movie = movieArrays[array].find(movie => movie._id === movieID);
		if(movie.videoPaths.length === 0) {
			youtubePlayer.style.display = 'none';

			let newTag = document.createElement('h2');
			let newText = document.createTextNode('No trailer found for this movie!');
			newTag.style.color = 'white';
			newTag.appendChild(newText);
			innerTrailer.insertBefore(newTag, youtubePlayer);
		}else {
			youtubePlayer.src = `${movie.videoPaths[0]}?origin=${location.origin}`;
		}
	}
}

////////////
/// VIEW ///
////////////
const view = {
	displayMovies: function(userUL) {
		const array = helpers.getArray(userUL.id);

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
		const array = helpers.getArray(userUL.id);

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
			let posterPath, year;
			movie.poster_path ? posterPath = imagePath + movie.poster_path : posterPath = '';
			movie.release_date ? year = movie.release_date.split('-')[0] : year = '';

			return `
				<li class='movie_modal-movie'>
					<img src='${posterPath}' alt='missing movie poster'/>
					<div>
						<p>${movie.title} - ${year}</p>
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
	myAPI.getMovies()
		.then(response => {
			movieArrays.allMovies = [...response];
			movieArrays.dannyArr = movieArrays.allMovies.filter(movie => movie.array === 'dannyArr');
			movieArrays.lolaArr = movieArrays.allMovies.filter(movie => movie.array === 'lolaArr');
			view.displayMovies(document.getElementById('listDanny'));
			view.displayMovies(document.getElementById('listLola'));
			events.listeners();
		});
}
	