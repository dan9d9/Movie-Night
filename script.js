const movieArrays = {
	dannyArr: JSON.parse(localStorage.getItem('dannyMovies')) || [],
	lolaArr: JSON.parse(localStorage.getItem('lolaMovies')) || []
}

const movieList = {
	addMovie: function(movieTitle, array) {
		movieArrays[array].push({
			index: '',
			movieTitle,
			approved: false
		});
		this.assignIndex(array);
		handlers.setStorage();
	},

	deleteMovie: function(array, index) {
		movieArrays[array].splice(index, 1);
		this.assignIndex(array);
		handlers.setStorage();

	},

	approveMovie: function(array, index) {
		const movie = movieArrays[array][index];

		movie.approved = !movie.approved;
		handlers.setStorage();
	},
	assignIndex: function(array) {
		movieArrays[array].forEach((movie, index) => movie.index = index);
	} 
}

const handlers = {
	// setStorage is called after each movieList method
	setStorage: function() {
		const dannyArrString = JSON.stringify(movieArrays.dannyArr);
		const lolaArrString = JSON.stringify(movieArrays.lolaArr);

		localStorage.setItem('dannyMovies', dannyArrString);
		localStorage.setItem('lolaMovies', lolaArrString);
		},

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

		movieList.addMovie(movieTitle, array);
		view.displayMovies(userUL);
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
		movieList.addMovie(movieTitle, array);
		view.displayMovies(userUL);
	},

	listButtonsHandler: function(e) {
		if(e.target.tagName != 'BUTTON') {return}
	
		const index = e.target.parentNode.dataset.index;
		const userUL = this;
		let array;

		if(this.id === 'listDanny') {
			array = 'dannyArr';
		} else if(this.id === 'listLola') {
			array = 'lolaArr';
		}

		if(e.target.className === 'btnDelete') {
			movieList.deleteMovie(array, index);
			view.displayMovies(userUL);
		}	else {
			movieList.approveMovie(array, index);
			view.displayMovies(userUL);
		}
	}
}

const view = {
	displayMovies: function(userUL) {
		let array;

		if(userUL.id === 'listDanny') {
			array = 'dannyArr';
		} else if(userUL.id === 'listLola') {
			array = 'lolaArr';
		}

		userUL.innerHTML = movieArrays[array].map(movie => {
			// In older code object had 'title' property instead of 'movieTitle'. This 'if' 
			// statement makes sure either old or new objects will display correctly. I don't
			// think it's necessary to modify the old object property names, as they will 	       // eventually be deleted from storage anyway.  
			let movieTitle;

			if(movie.title) {
				movieTitle = movie.title;
			} else {
				movieTitle = movie.movieTitle;
			}

			return `
		<li class='itemClass' data-index=${movie.index}>
			${movieTitle}
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
				const movieLiToApprove = userUL.querySelector(`li[data-index='${index}']`);
				const movieButtonToApprove = movieLiToApprove.children[0];

				movieLiToApprove.classList.toggle('js-approve');
				movieButtonToApprove.classList.toggle('js-approve');
			}	
		});
	}
}

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

window.onload = function() {
	view.displayMovies(document.getElementById('listDanny'));
	view.displayMovies(document.getElementById('listLola'));
	events.listeners();
}
	