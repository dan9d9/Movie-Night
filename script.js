const listDanny = document.getElementById('listDanny');
const listLola = document.getElementById('listLola');
const buttons = document.querySelectorAll('button');
const inputs = Array.from(document.getElementsByClassName('input'));
const inputDanny = document.getElementById('inputDanny');
const inputLola = document.getElementById('inputLola');

//Arrays to store movies
const dannyArray = JSON.parse(localStorage.getItem('dannyMovies')) || [];
const lolaArray = JSON.parse(localStorage.getItem('lolaMovies')) || [];

// Delete item from list and save array
function deleteItem(list, target) {	
	const movieToDelete = Number(target.dataset.index);

	if(list === 'listDanny') {
		dannyArray.forEach((obj, i) => {
			obj.index === movieToDelete ? dannyArray.splice(i, 1) : "";
			localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
			target.parentElement.remove();
		});		
	}
	else {
		lolaArray.forEach((obj, i) => {
			obj.index === movieToDelete ? lolaArray.splice(i, 1) : "";
			localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
			target.parentElement.remove();
		});	
	}
}

// Toggle approved on btnApprove click
function approveItem(list, target) {
	const movieToApproveIndex = Number(target.dataset.index);
	
	if(list === 'listDanny') {
		for(let i=0;i<dannyArray.length;i++) {
			dannyArray[i].index === movieToApproveIndex ? dannyArray[i].approved = !dannyArray[i].approved : "";
		}	
		target.classList.toggle('js-approve');
		target.parentElement.classList.toggle('js-approve');		
		localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
	}
	else {
		for(let i=0;i<lolaArray.length;i++) {
			lolaArray[i].index === movieToApproveIndex ? lolaArray[i].approved = !lolaArray[i].approved : "";
		}		
		target.classList.toggle('js-approve');
		target.parentNode.classList.toggle('js-approve');
		localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
	}	
}

// Listeners for approve and delete buttons
listDanny.addEventListener('click', function(e){
	const list = this.id;
	const target = e.target;

	switch (target.className){
		case 'btnDelete':
			deleteItem(list, target);
			break;
		case 'btnApprove':
			approveItem(list, target);
			break;
		case 'btnApprove js-approve':
			approveItem(list, target);
			break;
	}
});
			
listLola.addEventListener('click', function(e){
	const list = this.id;
	const target = e.target;

	switch (target.className){
		case 'btnDelete':
			deleteItem(list, target);
			break;
		case 'btnApprove':
			approveItem(list, target);
			break;
		case 'btnApprove js-approve':
			approveItem(list, target);
			break;
	}
});

// Toggle approved after list is re-created
function markApproved(array, list) {
	array.forEach(obj => {
		let index = obj.index;
		let target = list.querySelector(`.btnApprove[data-index='${index}']`);

		if(obj.approved === true) {
			target.classList.toggle('js-approve');
			target.parentElement.classList.toggle('js-approve');
		}

	});
}

// Create list on page load and when new item is added
function createList(array = [], list) {	
	if(array === []) {return}

	list.innerHTML = array.map((movie) => {
		return `
			<li class='itemClass' contenteditable="true" data-list=${list.id} data-index=${movie.index}>
				${movie.title}
				<button class='btnApprove' data-index=${movie.index}>\u2713</button>
				<button class='btnDelete' data-index=${movie.index}>\u2717</button>
			</li>
		`;
	}).join('');

	markApproved(array, list);
}

function newItem(movieTitle, input) {
	console.log(input);
	const title = movieTitle;
	const item = {
		index: '',
		title,
		approved: false
	};

	if(input === 'inputDanny') {
		dannyArray.push(item)
		for(let i=0;i<dannyArray.length;i++){
			dannyArray[i].index = i;
		}
		const list = listDanny;
		const array = dannyArray;

		localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
		createList(array, list);
	} 
	else {
		lolaArray.push(item);
		for(let i=0;i<lolaArray.length;i++){
			lolaArray[i].index = i;
		}
		const list = listLola;
		const array = lolaArray;

		localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
		createList(array, list);
	}
}

function clickFunk(e) {
	if(e.target.id === "btnDanny") {
		const movieTitle = inputDanny.value;

		newItem(movieTitle, 'inputDanny');
		inputDanny.value = '';
	}
	else {
		const movieTitle = inputLola.value;

		newItem(movieTitle, 'inputLola');
		inputLola.value = '';
	} 	
}

function enterFunk(e) {
	if(e.keyCode != 13) {return;}
	else {
		const input = this.id
		const movieTitle = this.value;

		movieTitle === "" ? this.placeholder = "Please enter a movie" :
		newItem(movieTitle, input);
		this.value = '';
	}
}

buttons.forEach(btn => btn.addEventListener('click', clickFunk));
inputs.forEach(input => input.addEventListener('keypress', enterFunk));

function convertOldArray(array, input) {
	if(array === []) {return;}
	array.forEach(movieTitle => {
		if(typeof movieTitle === 'object') {return;}
		else {
			console.log(input);
			newItem(movieTitle, input);
		}
	});
}

convertOldArray(dannyArray, 'inputDanny');
convertOldArray(lolaArray, 'inputLola');

// createList(dannyArray, listDanny);
// createList(lolaArray, listLola);