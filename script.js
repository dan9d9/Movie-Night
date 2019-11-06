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

// function createBtnDelete() {
// 	let btn = document.createElement('button');
// 	btn.className = 'btnClass';
// 	btn.appendChild(document.createTextNode('\u2717'));
// 	return btn;
// }
// function createBtnApprove() {
// 	let btn = document.createElement('button');
// 	btn.className = 'btnClass2';
// 	btn.appendChild(document.createTextNode('\u2713'));
// 	return btn;
// }
// function createItem() {
// 	let item = document.createElement('li');
// 	item.className = 'itemClass';
// 	item.setAttribute('contenteditable', 'true');
// 	return item;
// }
// function appendItemsBtns(list, item, btn, btn2) {
// 	list.appendChild(item);
// 	item.appendChild(btn);
// 	item.appendChild(btn2);
// }

// function addItem(user, value) {
	
// 	let item = createItem();
	
// 	let btn = createBtnDelete();
	
// 	let btn2 = createBtnApprove();	
	
// 	if (user === "Danny" && !value) {
// 		item.appendChild(document.createTextNode(inputDanny.value));
// 		appendItemsBtns(listDanny, item, btn, btn2);
// 		inputDanny.value = "";		
// 		dannyArray.push(item.childNodes[0].nodeValue);	// Push movie title to movie array

// 	}  	else if (user === "Danny" && value) {
// 		item.appendChild(document.createTextNode(value));
// 		appendItemsBtns(listDanny, item, btn, btn2);
		
// 	}  	else if (user === "Lola" && !value) {
// 		item.appendChild(document.createTextNode(inputLola.value));
// 		appendItemsBtns(listLola, item, btn, btn2);
// 		inputLola.value = "";
// 		lolaArray.push(item.childNodes[0].nodeValue);	// Push movie title to movie array
		
// 	}	else if (user === "Lola" && value) {
// 		item.appendChild(document.createTextNode(value));
// 		appendItemsBtns(listLola, item, btn, btn2);
// 	}				
// }

// Remove deleted movie from corresponding array
// To fix - Multiple movies of the same name are only deleted if deleted togther 
function removeMovie(list, arr) {
	let textContentArray = Array.from(list.children).map(node => node.firstChild.textContent);
	for(let i=0; i < arr.length; i++) {
		if(textContentArray.indexOf(arr[i].title) === -1) { 
			arr.splice(i, 1);
			i = -1;
		}
	} 
	localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
	localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
}

// Delete item from list
function deleteItem(target) {	
	const list = target.dataset.list;
	const index = target.dataset.index;

	if(list === 'listDanny') {
		listDanny.querySelector(`[data-index='${index}']`).remove();	
	}
	else {
		listLola.querySelector(`[data-index='${index}']`).remove();
	}

			
}

function approveItem(e, btn) {
	if(btn === null){	// From event listener
		e.target.classList.toggle('btnClass-approve');
		e.target.parentNode.classList.toggle('btnClass-approve');
	}
	
	if(e === null){		// From assignStamps function
		btn.classList.toggle('btnClass-approve');
		btn.parentNode.classList.toggle('btnClass-approve');	
	}	
}

listDanny.addEventListener('click', function(e){
	switch (e.target.className){
		case 'btnClass':
			deleteItem(e.target);
			break;
		case 'btnClass2':
			approveItem(e, null);
			break;
		case 'btnClass2 btnClass-approve':
			approveItem(e, null);
			break;
	}
});
			
listLola.addEventListener('click', function(e){
	switch (e.target.className){
		case 'btnClass':
			deleteItem(e.target);
			break;
		case 'btnClass2':
			approveItem(e, null);
			break;
		case 'btnClass2 btnClass-approve':
			approveItem(e, null);
			break;
	}
});

function createList(array = [], list) {
	if(array === []) {return}

	list.innerHTML = array.map((movie, i) => {
		return `
			<li class='itemClass' data-list=${list.id} data-index=${i}>
				${movie.title}
				<button class='btnClass2' data-list=${list.id} data-index=${i}>\u2713</button>
				<button class='btnClass' data-list=${list.id} data-index=${i}>\u2717</button>
			</li>
		`;
	}).join('');
}

function newItem(movieTitle, input) {
	const title = movieTitle;
	const item = {
		title,
		approve: false
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

// function hasContent(user) {

// 	if(user === "Danny" && inputDanny.value === "") {
// 		return inputDanny.placeholder = "Please enter a movie";
	
// 	} else if(user === "Danny" && inputDanny.value !== "") {
// 		addItem("Danny", null);
	
// 	} else if(user === "Lola" && inputLola.value === "") {
// 		return inputLola.placeholder = "Please enter a movie";
	
// 	} else {addItem("Lola", null);}
// }

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

// Compare each list with saved stamp states and add stamp class
// function assignStamps(list, stamps) {	
// 	const btns = Array.from(list.getElementsByClassName("btnClass2"));

// 	for(let i=0;i<btns.length;i++) {
// 		if(stamps[i] === true) {
// 			approveItem(null, btns[i]);
// 		}
// 	}
// }

// Save current states of movie arrays and stamps
function saveFunk(state1, state2) {
		localStorage.setItem('dannyStamps', JSON.stringify(state1));
		localStorage.setItem('lolaStamps', JSON.stringify(state2));
	}

// Record states of stamps and pass to save function
function isStampVisible() {
	const dannyStampStates = Array.from(listDanny.getElementsByClassName("btnClass2"))
								.map(btn => btn.className === 'btnClass2 btnClass-approve');

	const lolaStampStates = Array.from(listLola.getElementsByClassName("btnClass2"))
								.map(btn => btn.className === 'btnClass2 btnClass-approve');

	saveFunk(dannyStampStates, lolaStampStates);
}

// function populateList() {
	
// 	// Add saved movie titles to lists
// 	dannyArray.forEach(movie => newItem(movie, 'inputDanny'));
// 	lolaArray.forEach(movie => newItem(movie, 'inputLola'));

// 	// Add saved stamps to items
// 	// assignStamps(listDanny, dannyStampStates);	
// 	// assignStamps(listLola, lolaStampStates);
// }

// buttons.forEach(btn => btn.addEventListener('click', clickFunk));
inputs.forEach(input => input.addEventListener('keypress', enterFunk));
submit.addEventListener('click', isStampVisible);	// Save button
createList(dannyArray, listDanny);
createList(lolaArray, listLola);
