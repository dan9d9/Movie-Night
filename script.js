const APIKEY = 'ad4a44a2296a174ca3a693f429400547';


//////////////
/// ARRAYS ///
//////////////
const movieArrays = {
	dannyArr: [],
	lolaArr: [],
	allMovies: [],
	searchedMovies: []
}


/////////////////////
/// HTTP REQUESTS ///
/////////////////////
const httpRequests = {
	addMovie: async function(movieTitle, array) {
		try {
			const response = await axios.post('http://localhost:3000/movies/new', {
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
			const response = await axios.delete(`http://localhost:3000/movies/${id}`);
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
			const response = await axios.get('http://localhost:3000/movies');
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

	approveMovie: async function(array, id) {
		try {
			const response = await axios.patch(`http://localhost:3000/movies/${id}`);
			if(response.statusText === 'OK') {	
				movieList.approveMovie(array, id);
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
	getMovie: async function(query) {
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${query}&page=1&include_adult=false`);
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
	}
}


/////////////////////
/// ARRAY METHODS ///
/////////////////////
const movieList = {
	addMovie: function(movieData) {
		movieArrays[movieData.array].push(movieData);
		// this.assignIndex(movieData.array);
	},

	deleteMovie: function(array, id) {
		let index = movieArrays[array].findIndex(ele => ele._id === id);
		movieArrays[array].splice(index, 1);
		// this.assignIndex(array);
	},

	approveMovie: function(array, id) {
		let index = movieArrays[array].findIndex(ele => ele._id === id);
		const movie = movieArrays[array][index];

		movie.approved = !movie.approved;
	},
	// assignIndex: function(array) {
	// 	movieArrays[array].forEach((movie, index) => movie.index = index);
	// } 
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
		if(e.target.tagName != 'BUTTON') {return}
	
		const id = e.target.parentNode.dataset.id;
		const userUL = this;
		let array;

		if(this.id === 'listDanny') {
			array = 'dannyArr';
		} else if(this.id === 'listLola') {
			array = 'lolaArr';
		}

		if(e.target.className === 'btnDelete') {
			httpRequests.deleteMovie(array, id).then(() => {
				view.displayMovies(userUL);
			});
			
		}else if(e.target.className === 'btnApprove') {
			httpRequests.approveMovie(array, id).then(() => {
				view.displayMovies(userUL);	
			});	
		}
	},

	openMovieModal: function(e) {
		if(e.target.tagName !== 'LI') {return}
		const movieModal = document.getElementById('movie_modal');
		const array = this.parentNode.id;


		movieModal.style.display = 'block';

		tmdbRequests.getMovie(this.dataset.title).then(() => {
			view.displayMovieResults(e.target, movieArrays.searchedMovies);
			
		});
	},

	closeMovieModal: function() {
		const movieModal = document.getElementById('movie_modal');

		movieArrays.searchedMovies = [];
		movieModal.style.display = 'none';
	},

	chooseMovie: function(e) {
		console.log(e);
		console.log(this);
	}
}


////////////
/// VIEW ///
////////////
const view = {
	displayMovies: function(userUL) {
		let array;

		if(userUL.id === 'listDanny') {
			array = 'dannyArr';
		} else if(userUL.id === 'listLola') {
			array = 'lolaArr';
		}

		userUL.innerHTML = movieArrays[array].map(movie => {
		return `
			<li class='itemClass' data-title=${movie.title} data-movie_info='false' data-id=${movie._id}>
				${movie.title}
				<button class='btnApprove'>\u2713</button>
				<button class='btnDelete'>\u2717</button>
			</li>
		`;
		}).join('');

		view.displayApproved(userUL);
	},

	displayApproved: function(userUL) {
		let array; 

		if(userUL.id === 'listDanny') {
			array = 'dannyArr';
		} else if(userUL.id === 'listLola') {
			array = 'lolaArr';
		}

		movieArrays[array].forEach((movie, index) => {
			if(movie.approved) {
				const movieLiToApprove = userUL.querySelector(`li[data-id='${movie._id}']`);
				const movieButtonToApprove = movieLiToApprove.children[0];

				movieLiToApprove.classList.toggle('js-approve');
				movieButtonToApprove.classList.toggle('js-approve');
			}	
		});
	},

	displayMovieResults: function(target, movieArray) {
		console.log('target', target);
		const movieList = document.getElementById('movie_modal-list');
		if(movieArray.length === 0) {
			return movieList.innerHTML = `<li>No results for that search</li>`;
		}

		movieList.innerHTML = movieArray.map(movie => {
			const imagePath = 'https://image.tmdb.org/t/p/w185/';
			let posterPath;

			if(movie.poster_path) {
				posterPath = imagePath + movie.poster_path;
			}else {
				posterPath = '';
			}

			return `
				<li class='movie_modal-movie'>
					<img src='${posterPath}' alt='missing movie poster'/>
					<div>
						<p>${movie.title}</p>
						<p>${movie.overview}</p>
					</div>
					<button onclick=${handlers.chooseMovie(target)}>Choose</button>
				</li>
			`
		}).join('');

		// const movieBtns = document.querySelectorAll('.movie_modal-movie button');
		// movieBtns.forEach(btn => addEventListener('click', handlers.chooseMovie.bind(null, evt, target)));
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
		const listItems = document.querySelectorAll('li');

		listItems.forEach(li => li.addEventListener('click', handlers.openMovieModal));
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
	