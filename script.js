// const listDanny = document.getElementById('listDanny');
// const listLola = document.getElementById('listLola');
// const buttons = document.querySelectorAll('button');
// const inputs = Array.from(document.getElementsByClassName('input'));
// const inputDanny = document.getElementById('inputDanny');
// const inputLola = document.getElementById('inputLola');

// //Arrays to store movies
// const dannyArray = JSON.parse(localStorage.getItem('dannyMovies')) || [];
// const lolaArray = JSON.parse(localStorage.getItem('lolaMovies')) || [];

// function setStorage() {
// 	localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
// 	localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
// }

// // Delete item from list and save array
// function deleteItem(list, target) {	
// 	const movieToDelete = Number(target.dataset.index);

// 	if(list === 'listDanny') {
// 		dannyArray.forEach((obj, i) => {
// 			obj.index === movieToDelete ? dannyArray.splice(i, 1) : "";
// 			setStorage()
// 			target.parentElement.remove();
// 		});		
// 	}
// 	else {
// 		lolaArray.forEach((obj, i) => {
// 			obj.index === movieToDelete ? lolaArray.splice(i, 1) : "";
// 			setStorage()
// 			target.parentElement.remove();
// 		});	
// 	}
// }

// // Toggle approved on btnApprove click
// function approveItem(list, target) {
// 	const movieToApproveIndex = Number(target.dataset.index);
	
// 	if(list === 'listDanny') {
// 		for(let i=0;i<dannyArray.length;i++) {
// 			dannyArray[i].index === movieToApproveIndex ? dannyArray[i].approved = !dannyArray[i].approved : "";
// 		}	
// 		target.classList.toggle('js-approve');
// 		target.parentElement.classList.toggle('js-approve');		
// 		setStorage()
// 	}
// 	else {
// 		for(let i=0;i<lolaArray.length;i++) {
// 			lolaArray[i].index === movieToApproveIndex ? lolaArray[i].approved = !lolaArray[i].approved : "";
// 		}		
// 		target.classList.toggle('js-approve');
// 		target.parentNode.classList.toggle('js-approve');
// 		setStorage()
// 	}	
// }

// // Listeners for approve and delete buttons
// listDanny.addEventListener('click', function(e){
// 	const list = this.id;
// 	const target = e.target;

// 	switch (target.className) {
// 		case 'btnDelete':
// 			deleteItem(list, target);
// 			break;
// 		case 'btnApprove':
// 			approveItem(list, target);
// 			break;
// 		case 'btnApprove js-approve':
// 			approveItem(list, target);
// 			break;
// 	}
// });
			
// listLola.addEventListener('click', function(e){
// 	const list = this.id;
// 	const target = e.target;

// 	switch (target.className) {
// 		case 'btnDelete':
// 			deleteItem(list, target);
// 			break;
// 		case 'btnApprove':
// 			approveItem(list, target);
// 			break;
// 		case 'btnApprove js-approve':
// 			approveItem(list, target);
// 			break;
// 	}
// });

// // Toggle approved after list is re-created
// function markApproved(array, list) {
// 	array.forEach(obj => {
// 		let index = obj.index;
// 		let target = list.querySelector(`.btnApprove[data-index='${index}']`);

// 		if(obj.approved === true) {
// 			target.classList.toggle('js-approve');
// 			target.parentElement.classList.toggle('js-approve');
// 		}
// 	});
// }

// // Create list on page load and when new item is added
// function createList(array = [], list) {	
// 	if(array === []) {return}

// 	list.innerHTML = array.map((movie) => {
// 		return `
// 			<li class='itemClass' data-list=${list.id} data-index=${movie.index}>
// 				${movie.title}
// 				<button class='btnApprove' data-index=${movie.index}>\u2713</button>
// 				<button class='btnDelete' data-index=${movie.index}>\u2717</button>
// 			</li>
// 		`;
// 	}).join('');

// 	markApproved(array, list);
// }

// function assignIndex(array) {
// 	for(let i=0;i<array.length;i++){
// 			array[i].index = i;
// 	} 
// }

// function createItemObject(movieTitle) {
// 	const title = movieTitle;
// 	const item = {
// 		index: '',
// 		title,
// 		approved: false
// 	};
// 	return item;
// }

// function clickFunk(e) {
// 	let movieTitle;
// 	let array;
// 	let list;

// 	if(e.target.id === "btnDanny") {
// 		movieTitle = inputDanny.value;
// 		array = dannyArray;
// 		list = listDanny;

// 		if(movieTitle == "") {
// 			inputDanny.placeholder = "Please enter a movie";
// 			return;
// 		}
// 	}
// 	else {
// 		movieTitle = inputLola.value;
// 		array = lolaArray;
// 		list = listLola;

// 		if(movieTitle == "") {
// 			inputLola.placeholder = "Please enter a movie";
// 			return;
// 		}
// 	}
	
// 	const item = createItemObject(movieTitle);
// 	array.push(item);
// 	assignIndex(array);
// 	setStorage();
// 	createList(array, list);
// 	movieTitle = '';
// }

// function enterFunk(e) {
// 	if(e.keyCode != 13) {return;}
// 	else {	
// 		const input = this.id
// 		const movieTitle = this.value;
// 		let array;
// 		let list;
		
// 		if(movieTitle == "") {
// 			this.placeholder = "Please enter a movie";
// 			return;
// 		} 

// 		if(input === 'inputDanny') {
// 			array = dannyArray;
// 			list = listDanny;
// 		} else {
// 			array = lolaArray;
// 			list = listLola;
// 		}
	
// 		const item = createItemObject(movieTitle);
// 		array.push(item);
// 		assignIndex(array);
// 		setStorage();
// 		createList(array, list);
// 		this.value = '';
// 	}
// }

// buttons.forEach(btn => btn.addEventListener('click', clickFunk));
// inputs.forEach(input => input.addEventListener('keypress', enterFunk));

// createList(dannyArray, listDanny);
// createList(lolaArray, listLola);










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
	},

	deleteMovie: function(array, index) {
		movieArrays[array].splice(index, 1);
	},

	approveMovie: function(array, index) {
		const movie = movieArrays[array][index];

		movie.approved = !movie.approved;
	} 
}

const handlers = {
	// setStorage is called inside of view.displayMovies method
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

		movieList.addMovie(movieTitle, array);
		this.value = '';
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

		movieArrays[array].forEach((movie, index) => movie.index = index);

		userUL.innerHTML = movieArrays[array].map(movie => {
			return `
		<li class='itemClass' data-index=${movie.index}>
			${movie.movieTitle}
			<button class='btnApprove'>\u2713</button>
			<button class='btnDelete'>\u2717</button>
		</li>
	`;
		}).join('');

		view.displayApproved(userUL);
		handlers.setStorage();
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
	