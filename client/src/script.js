const myAPI = require('./myAPI');
const tmdbAPI = require('./tmdbAPI');
const BASE_IMAGE_PATH = 'https://image.tmdb.org/t/p/w185';
const BASE_VIDEO_PATH = 'https://www.youtube.com/embed';

const inputDanny = document.getElementById('inputDanny');
const inputLola = document.getElementById('inputLola');
const listDanny = document.getElementById('listDanny');
const listLola = document.getElementById('listLola');

const welcomeModal = document.getElementById('welcome_modal');
const movieModal = document.getElementById('movie_modal');
const movieResultsModal = document.getElementById('results_modal');
const modalMovieList = document.getElementById('movie_modal-list');
const trailerModal = document.getElementById('trailer_modal');
const trailerCounter = document.getElementById('trailer_counter');
const trailerContainer = document.getElementById('trailer_container');
const youtubePlayer = document.getElementById('player');
const prevButton = document.getElementById('prevTrailer');
const nextButton = document.getElementById('nextTrailer');

//////////////
/// ARRAYS ///
//////////////
const state = {
  dannyArr: [],
  lolaArr: [],
  allMovies: [],
  searchedMovies: [],
  currentMovie: {},
  currentTrailer: 0,
};

///////////////
/// HELPERS ///
///////////////
const helpers = {
  getArray: function (userUL) {
    if (userUL === 'listDanny') {
      return 'dannyArr';
    } else if (userUL === 'listLola') {
      return 'lolaArr';
    }
  },

  createH2Ele: function (parentEle, beforeThisEle, text) {
    let newTag = document.createElement('h2');
    let newText = document.createTextNode(`No ${text} found for this movie!`);
    newTag.style.color = 'white';
    newTag.style.textAlign = 'center';
    newTag.appendChild(newText);
    parentEle.insertBefore(newTag, beforeThisEle);
  },
};

/////////////////////
/// ARRAY METHODS ///
/////////////////////
const modifyMovieArray = {
  addMovie: function (movieData) {
    state[movieData.array].push(movieData);
  },

  deleteMovie: function (array, id) {
    const index = state[array].findIndex((ele) => ele._id === id);
    state[array].splice(index, 1);
  },

  approveMovie: function (array, id) {
    const movie = state[array].find((ele) => ele._id === id);
    movie.approved = !movie.approved;
    return movie;
  },

  updateMovie: function (movieToUpdate, movieDetails, videos) {
    const tempVids = videos.map((video) => `${BASE_VIDEO_PATH}/${video.key}`);
    const movieIdx = state[movieToUpdate.array].findIndex((ele) => ele._id === movieToUpdate._id);

    movieToUpdate = {
      ...movieToUpdate,
      title: movieDetails.title,
      hasInfo: true,
      summary: movieDetails.overview,
      posterPath: `${BASE_IMAGE_PATH}${movieDetails.poster_path}`,
      videoPaths: tempVids,
    };

    state[movieToUpdate.array][movieIdx] = movieToUpdate;

    return movieToUpdate;
  },
};

////////////////
/// HANDLERS ///
////////////////
const handlers = {
  inputButtonClick: function () {
    let movieTitle, array, userUL, input;

    if (this.id === 'btnDanny') {
      movieTitle = inputDanny.value.trim();
      userUL = listDanny;
      array = 'dannyArr';
    } else if (this.id === 'btnLola') {
      movieTitle = inputLola.value.trim();
      userUL = listLola;
      array = 'lolaArr';
    }

    input.value = '';
    if (!movieTitle) {
      return (input.placeholder = 'Please enter a valid movie title');
    }
    input.placeholder = 'Enter a movie';

    myAPI.addMovie(movieTitle, array).then((response) => {
      modifyMovieArray.addMovie(response);
      view.displayMovies(userUL);
    });
  },

  inputPressEnter: function (e) {
    if (e.keyCode !== 13) {
      return;
    }

    const movieTitle = this.value.trim();

    this.value = '';
    if (!movieTitle) {
      return (this.placeholder = 'Please enter a valid movie title');
    }
    this.placeholder = 'Enter a movie';

    let array;
    let userUL;

    if (this.id === 'inputDanny') {
      userUL = listDanny;
      array = 'dannyArr';
    } else if (this.id === 'inputLola') {
      userUL = listLola;
      array = 'lolaArr';
    }

    myAPI.addMovie(movieTitle, array).then((response) => {
      modifyMovieArray.addMovie(response);
      view.displayMovies(userUL);
    });
  },

  listButtonsHandler: function (e) {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'LI') {
      return;
    }

    const id = e.target.parentNode.dataset.id;
    const userUL = this;
    const array = helpers.getArray(this.id);

    if (e.target.tagName === 'LI') {
      modals.openMovieModal();
      if (e.target.dataset.movie_info === 'false') {
        modals.openMovieResultsModal(e.target);
      } else if (e.target.dataset.movie_info === 'true') {
        modals.openTrailerModal(array, e.target.dataset.id);
      }
    } else if (e.target.className === 'btnDelete') {
      myAPI.deleteMovie(array, id).then(() => {
        modifyMovieArray.deleteMovie(array, id);
        view.displayMovies(userUL);
      });
    } else if (
      e.target.className === 'btnApprove' ||
      e.target.className === 'btnApprove js-approve'
    ) {
      let movieApproved = modifyMovieArray.approveMovie(array, id);
      myAPI.approveMovie(movieApproved).then(() => {
        view.displayMovies(userUL);
      });
    }
  },

  resultsModalHandler: function (clickOrigin, e) {
    if (e.target.dataset.movie_id) {
      modals.chooseMovie(e.target.dataset.movie_id, clickOrigin);
    }
  },

  closeModalsHandler: function (e) {
    if (e.target.className === 'close_modal' || e.target.className === 'close_modal-span') {
      modals.closeModals();
    } else if (e.target.id === 'prevTrailer') {
      modals.prevTrailer();
    } else if (e.target.id === 'nextTrailer') {
      modals.nextTrailer();
    }
  },

  closeWelcomeModal: function () {
    welcomeModal.classList.add('modal-hide');
    welcomeModal.removeEventListener('click', handlers.closeWelcomeModal);
  },
};

//////////////////////
/// MODALS METHODS ///
//////////////////////
const modals = {
  openMovieModal: function () {
    movieModal.classList.add('modal-visible-block');

    movieModal.addEventListener('click', handlers.closeModalsHandler);
  },

  openMovieResultsModal: function (clickedListItem) {
    movieResultsModal.classList.add('modal-visible-block');

    handlers.boundResultsHandler = handlers.resultsModalHandler.bind(null, clickedListItem);
    movieResultsModal.addEventListener('click', handlers.boundResultsHandler);

    const movieId = clickedListItem.dataset.id;
    const array = helpers.getArray(clickedListItem.parentNode.id);
    const movieTitle = state[array].find((ele) => ele._id === movieId).title;

    tmdbAPI.getMovies(movieTitle).then((movieResults) => {
      state.searchedMovies = [...movieResults];
      view.displayMovieResults(state.searchedMovies);
    });
  },

  chooseMovie: function (movieID, clickedListItem) {
    const array = helpers.getArray(clickedListItem.parentNode.id);
    const movieToUpdate = state[array].find((movie) => movie._id === clickedListItem.dataset.id);

    tmdbAPI.getMovieDetails(movieID).then((details) => {
      tmdbAPI.getMovieVideos(details.id).then((videos) => {
        const updatedMovie = modifyMovieArray.updateMovie(movieToUpdate, details, videos.results);

        clickedListItem.dataset.movie_info = 'true';
        myAPI.updateMovie(updatedMovie).then((response) => {
          modals.closeModals();
          view.displayMovies(clickedListItem.parentNode);
        });
      });
    });
  },

  openTrailerModal: function (array, movieID) {
    prevButton.style.display = 'block';
    nextButton.style.display = 'block';

    trailerModal.classList.add('modal-visible-flex');
    state.currentMovie = state[array].find((movie) => movie._id === movieID);
    console.log(state.currentMovie);
    view.refreshTrailerCounter();

    if (state.currentMovie.videoPaths.length === 0) {
      helpers.createH2Ele(trailerModal, trailerContainer, 'trailer');
      youtubePlayer.style.display = 'none';
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      this.loadTrailer();
    }
  },

  loadTrailer: function () {
    youtubePlayer.src = `${state.currentMovie.videoPaths[state.currentTrailer]}?origin=${
      location.origin
    }`;
  },

  nextTrailer: function () {
    state.currentTrailer === state.currentMovie.videoPaths.length - 1
      ? (state.currentTrailer = 0)
      : state.currentTrailer++;

    if (state.currentMovie.videoPaths.length > 1) {
      view.refreshTrailerCounter();
      this.loadTrailer();
    }
  },

  prevTrailer: function () {
    state.currentTrailer === 0
      ? (state.currentTrailer = state.currentMovie.videoPaths.length - 1)
      : state.currentTrailer--;

    if (state.currentMovie.videoPaths.length > 1) {
      view.refreshTrailerCounter();
      this.loadTrailer();
    }
  },

  closeModals: function () {
    const h2 = trailerModal.querySelector('h2') || movieResultsModal.querySelector('h2');

    movieModal.removeEventListener('click', handlers.closeModalsHandler);
    movieResultsModal.removeEventListener('click', handlers.boundResultsHandler);

    if (h2 && h2.parentElement.id === 'trailer_modal') {
      trailerModal.removeChild(h2);
    } else if (h2 && h2.parentElement.id === 'results_modal') {
      movieResultsModal.removeChild(h2);
    }

    state.searchedMovies = [];
    state.currentMovie = {};
    state.currentTrailer = 0;
    modalMovieList.innerHTML = '';
    youtubePlayer.style.display = 'inline-block';
    youtubePlayer.src = '';

    trailerModal.classList.remove('modal-visible-flex');
    movieResultsModal.classList.remove('modal-visible-block');
    movieModal.classList.remove('modal-visible-block');
  },
};

////////////
/// VIEW ///
////////////
const view = {
  displayMovies: function (userUL) {
    const array = helpers.getArray(userUL.id);

    userUL.innerHTML = state[array]
      .map((movie) => {
        let hasInfo;
        movie.hasInfo ? (hasInfo = 'true') : (hasInfo = 'false');

        return `
				<li class='itemClass' data-movie_info=${hasInfo} data-id=${movie._id}>
					${movie.title}
					<button class='btnApprove'>\u2713</button>
					<button class='btnDelete'>\u2717</button>
				</li>
			`;
      })
      .join('');

    view.displayApproved(userUL);
  },

  displayApproved: function (userUL) {
    const array = helpers.getArray(userUL.id);

    state[array].forEach((movie, index) => {
      if (movie.approved) {
        const movieLiToApprove = userUL.querySelector(`li[data-id='${movie._id}']`);
        const movieButtonToApprove = movieLiToApprove.children[0];

        movieLiToApprove.classList.toggle('js-approve');
        movieButtonToApprove.classList.toggle('js-approve');
      }
    });
  },

  displayMovieResults: function (movieArray) {
    if (movieArray.length === 0) {
      return helpers.createH2Ele(movieResultsModal, modifyMovieArray, 'results');
    }

    modalMovieList.innerHTML = movieArray
      .map((movie) => {
        let posterPath, year;
        movie.poster_path ? (posterPath = BASE_IMAGE_PATH + movie.poster_path) : (posterPath = '');
        movie.release_date ? (year = movie.release_date.split('-')[0]) : (year = '');

        return `
				<li class='movie_modal-movie'>
					<img src='${posterPath}' alt='missing movie poster'/>
					<div>
						<p>${movie.title} - ${year}</p>
						<p>${movie.overview}</p>
					</div>
					<button data-movie_id=${movie.id}>Choose</button>
				</li>
			`;
      })
      .join('');
  },

  refreshTrailerCounter: function () {
    trailerCounter.innerHTML = `${state.currentTrailer + 1}/${
      state.currentMovie.videoPaths.length
    }`;
  },
};

///////////////////////
/// EVENT LISTENERS ///
///////////////////////
const events = {
  listeners: function () {
    const inputButtons = document.querySelectorAll('.btnContainer button');
    const inputs = Array.from(document.getElementsByClassName('input'));
    const usersUL = document.querySelectorAll('ul');
    const welcomeModalBtn = document.querySelector('#welcome_modal button');

    welcomeModalBtn.addEventListener('click', handlers.closeWelcomeModal);
    inputButtons.forEach((btn) => btn.addEventListener('click', handlers.inputButtonClick));
    inputs.forEach((input) => input.addEventListener('keypress', handlers.inputPressEnter));
    usersUL.forEach((ul) => ul.addEventListener('click', handlers.listButtonsHandler));
  },
};

///////////////
/// ON LOAD ///
///////////////
window.onload = function () {
  myAPI.getMovies().then((response) => {
    state.allMovies = [...response];
    state.dannyArr = state.allMovies.filter((movie) => movie.array === 'dannyArr');
    state.lolaArr = state.allMovies.filter((movie) => movie.array === 'lolaArr');
    view.displayMovies(listDanny);
    view.displayMovies(listLola);
    events.listeners();
  });
};
