const inputDanny = document.getElementById('inputDanny');
const inputLola =  document.getElementById('inputLola');
const listDanny = document.getElementById('listDanny');
const listLola = document.getElementById('listLola');
const buttons = document.querySelectorAll('button');
const inputs = Array.from(document.getElementsByClassName('input'));
const submit = document.getElementById('submitBtn');

//Arrays to store movies and stamps
const dannyArray = JSON.parse(localStorage.getItem('dannyMovies')) || [];
const lolaArray = JSON.parse(localStorage.getItem('lolaMovies')) || [];
const dannyStampStates = Array.from(JSON.parse(localStorage.getItem('dannyStamps'))) || [];
const lolaStampStates = Array.from(JSON.parse(localStorage.getItem('lolaStamps'))) || [];

// Delete item from list
function deleteItem(list, target) {	
	const movieToDelete = target.dataset.movie;

	if(list === 'listDanny') {
		dannyArray.forEach((obj, i) => {
			obj.title === movieToDelete ? dannyArray.splice(i, 1) : "";
			localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
			target.parentElement.remove();
		})		
	}
	else {
		lolaArray.forEach((obj, i) => {
			obj.title === movieToDelete ? lolaArray.splice(i, 1) : "";
			localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
			target.parentElement.remove();
		})	
	}			
}

function approveItem(list, target) {
	const movieToApprove = target.dataset.movie;

	if(list === 'listDanny') {
		dannyArray.forEach((obj) => {
			obj.title === movieToApprove ? obj.approved = !obj.approved : "";
			localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
			target.classList.toggle('btnClass-approve');
			target.parentNode.classList.toggle('btnClass-approve');
		})		
	}
	else {
		lolaArray.forEach((obj) => {
			obj.title === movieToApprove ? obj.approved = !obj.approved : "";
			localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
			target.classList.toggle('btnClass-approve');
			target.parentNode.classList.toggle('btnClass-approve');
		})		
	}	
}

listDanny.addEventListener('click', function(e){
	const list = this.id;
	const target = e.target;
	switch (e.target.className){
		case 'btnClass':
			deleteItem(list, target);
			break;
		case 'btnClass2':
			approveItem(list, target);
			break;
		case 'btnClass2 btnClass-approve':
			approveItem(list, target);
			break;
	}
});
			
listLola.addEventListener('click', function(e){
	const list = this.id;
	const target = e.target;
	switch (e.target.className){
		case 'btnClass':
			deleteItem(list, target);
			break;
		case 'btnClass2':
			approveItem(list, target);
			break;
		case 'btnClass2 btnClass-approve':
			approveItem(list, target);
			break;
	}
});

function createList(array = [], list) {	
	if(array === []) {return}

	list.innerHTML = array.map((movie, i) => {
		return `
			<li class='itemClass' data-list=${list.id} data-index=${i}>
				${movie.title}
				<button class='btnClass2' data-movie='${movie.title}'>\u2713</button>
				<button class='btnClass' data-movie='${movie.title}' data-index=${i}>\u2717</button>
			</li>
		`;
	}).join('');

	const approvedState = array.map(obj => obj.approved);
	for(let i=0;i<approvedState.length;i++) {
		if(approvedState[i] === 'true') {

		}
	}

}

function newItem(movieTitle, input) {
	const title = movieTitle;
	const item = {
		title,
		approved: false
	};

	if(input === 'inputDanny') {
		dannyArray.push(item)
		const list = listDanny;
		const array = dannyArray;
		localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
		createList(array, list);
	} 
	else {
		lolaArray.push(item);
		const list = listLola;
		const array = lolaArray;
		localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
		createList(array, list);
	} 
}

// function clickFunk(e) {
// 	console.log(this);
// 	e.target.id === "btnDanny" ? hasContent("Danny") 
// 	: e.target.id === "btnLola" ? hasContent("Lola")
// 	: "";
// }

function enterFunk(e) {

	if(e.keyCode != 13) {
		return;
	}
	else {
		const input = this.id
		const movieTitle = this.value;
		movieTitle === "" ? this.placeholder = "Please enter a movie" :
		newItem(movieTitle, input);
		this.value = '';
	}

}

// buttons.forEach(btn => btn.addEventListener('click', clickFunk));
inputs.forEach(input => input.addEventListener('keypress', enterFunk));
createList(dannyArray, listDanny);
createList(lolaArray, listLola);
