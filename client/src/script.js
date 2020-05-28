const myAPI = require('./myAPI');
const tmdbAPI = require('./tmdbAPI');
const BASE_IMAGE_PATH = 'https://image.tmdb.org/t/p/w185';
const BASE_VIDEO_PATH = 'https://www.youtube.com/embed';


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
  },
  
  createNoTrailerEle: function(parentEle) {
    let newTag = document.createElement('h2');
    let newText = document.createTextNode('No trailer found for this movie!');
    newTag.style.color = 'white';
    newTag.appendChild(newText);
    parentEle.insertBefore(newTag, youtubePlayer);
  }
}


/////////////////////
/// ARRAY METHODS ///
/////////////////////
const modifyMovieArray = {
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
		const tempVids = videos.map(video => `${BASE_VIDEO_PATH}/${video.key}`);
		const movieIdx = movieArrays[movieToUpdate.array].findIndex(ele => ele._id === movieToUpdate._id);

		movieToUpdate = {
      ...movieToUpdate,
			title: movieDetails.title, 
			hasInfo: true,
			summary: movieDetails.overview,
			posterPath: `${BASE_IMAGE_PATH}${movieDetails.poster_path}`,
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
			modifyMovieArray.addMovie(response);
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
			modifyMovieArray.addMovie(response);
			view.displayMovies(userUL);
		});
	},

	listButtonsHandler: function(e) {
		if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'LI') {return}

		const id = e.target.parentNode.dataset.id;
		const userUL = this;
		const array = helpers.getArray(this.id);

		if(e.target.tagName === 'LI') {
      modals.openMovieModal();
			if(e.target.dataset.movie_info === 'false') {
				modals.openMovieResultsModal(e.target);
			}else if(e.target.dataset.movie_info === 'true') {
				modals.openTrailerModal(array, e.target.dataset.id);
			}
		}else if(e.target.className === 'btnDelete') {
			myAPI.deleteMovie(array, id).then(() => {
				modifyMovieArray.deleteMovie(array, id);
				view.displayMovies(userUL);
			});	
		}else if(e.target.className === 'btnApprove' || e.target.className === 'btnApprove js-approve') {
			let movieApproved = modifyMovieArray.approveMovie(array, id);
			myAPI.approveMovie(movieApproved).then(() => {
				view.displayMovies(userUL);	
      });
		}
  },

  resultsModalHandler: function(clickOrigin, e) {
    if(e.target.dataset.movie_id) {
      modals.chooseMovie(e.target.dataset.movie_id, clickOrigin);
    }
  },

  closeModalsHandler: function(e) {
    if(e.target.className === 'close_modal' || e.target.className === 'close_modal-span') {
      modals.closeModals();
    }
  }
}


//////////////////////
/// MODALS METHODS ///
//////////////////////
const modals = {
  openMovieModal: function() {
    const movieModal = document.getElementById('movie_modal');
    movieModal.classList.add('movie_modal-visible');

		movieModal.addEventListener('click', handlers.closeModalsHandler);
  },

  openMovieResultsModal: function(clickedListItem) {
    const movieResultsModal = document.getElementById('results_modal');
    movieResultsModal.classList.add('movie_modal-visible');
    // movieResultsModal.style.display = 'block';

    handlers.boundResultsHandler = handlers.resultsModalHandler.bind(null, clickedListItem);
    movieResultsModal.addEventListener('click', handlers.boundResultsHandler);
    
		const movieId = clickedListItem.dataset.id;
		const array = helpers.getArray(clickedListItem.parentNode.id);	
		const movieTitle = movieArrays[array].find(ele => ele._id === movieId).title;
		

		tmdbAPI.getMovies(movieTitle).then(movieResults => {
			movieArrays.searchedMovies = [...movieResults];
			view.displayMovieResults(movieArrays.searchedMovies);
		});
  },
  
  chooseMovie: function(movieID, clickedListItem) {
		const array = helpers.getArray(clickedListItem.parentNode.id);
		const movieToUpdate = movieArrays[array].find(movie => movie._id === clickedListItem.dataset.id);

		tmdbAPI.getMovieDetails(movieID).then(details => {
			tmdbAPI.getMovieVideos(details.id).then(videos => {
				const updatedMovie = modifyMovieArray.updateMovie(movieToUpdate, details, videos.results);

				clickedListItem.dataset.movie_info = 'true';
				myAPI.updateMovie(updatedMovie).then(response => {
					modals.closeModals();
					view.displayMovies(clickedListItem.parentNode);
				});
			});
		});
	},

  openTrailerModal: function(array, movieID) {
		const trailerModal = document.getElementById('trailer_modal');
		const youtubePlayer = document.getElementById('player');

    trailerModal.classList.add('trailer_modal-visible');

		const movie = movieArrays[array].find(movie => movie._id === movieID);
		if(movie.videoPaths.length === 0) {
			youtubePlayer.style.display = 'none';

      helpers.createNoTrailerEle(trailerModal);
		}else {
			youtubePlayer.src = `${movie.videoPaths[0]}?origin=${location.origin}`;
		}
  },

  closeModals: function() {
    const movieModal = document.getElementById('movie_modal');
    const movieResultsModal = document.getElementById('results_modal');
		const trailerModal = document.getElementById('trailer_modal');
		const h2 = trailerModal.querySelector('h2');
		const youtubePlayer = document.getElementById('player');

    movieModal.removeEventListener('click', handlers.closeModalsHandler);
    movieResultsModal.addEventListener('click', handlers.boundResultsHandler);

		if(h2) {trailerModal.removeChild(h2)};
		movieArrays.searchedMovies = [];
		youtubePlayer.style.display = 'inline-block';
    youtubePlayer.src = "";

    trailerModal.classList.remove('trailer_modal-visible');
    movieResultsModal.classList.remove('movie_modal-visible');
    movieModal.classList.remove('movie_modal-visible');
	},
  

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
		const modifyMovieArray = document.getElementById('movie_modal-list');

		if(movieArray.length === 0) {
			return modifyMovieArray.innerHTML = `<li>No results for that search</li>`;
		}

		modifyMovieArray.innerHTML = movieArray.map(movie => {
			let posterPath, year;
			movie.poster_path ? posterPath = BASE_IMAGE_PATH + movie.poster_path : posterPath = '';
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
	