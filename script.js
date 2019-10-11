const inputDanny = document.getElementById('inputDanny');
const inputLola =  document.getElementById('inputLola');
const listDanny = document.getElementById('listDanny');
const listLola = document.getElementById('listLola');
const buttons = document.querySelectorAll('button');
const inputs = Array.from(document.getElementsByClassName('input'));
const submit = document.getElementById('submitBtn');

//Arrays to store movies
let dannyArray = [];
let lolaArray = [];

function createBtnDelete() {
	let btn = document.createElement('button');
	btn.className = 'btnClass';
	btn.appendChild(document.createTextNode('\u2717'));
	return btn;
}
function createBtnApprove() {
	let btn = document.createElement('button');
	btn.className = 'btnClass2';
	btn.appendChild(document.createTextNode('\u2713'));
	return btn;
}
function createItem() {
	let item = document.createElement('li');
	item.className = 'itemClass';
	return item;
}
function appendItemsBtns(list, item, btn, btn2) {
	list.appendChild(item);
	item.appendChild(btn);
	item.appendChild(btn2);
}

function addItem(user, value) {
	
	let item = createItem();
	
	let btn = createBtnDelete();
	
	let btn2 = createBtnApprove();	
	
	if (user === "Danny" && !value) {
		item.appendChild(document.createTextNode(inputDanny.value));
		appendItemsBtns(listDanny, item, btn, btn2);
		inputDanny.value = "";		
		dannyArray.push(item.childNodes[0].nodeValue);	// Push movie title to movie array

	}  	else if (user === "Danny" && value) {
		item.appendChild(document.createTextNode(value));
		appendItemsBtns(listDanny, item, btn, btn2);
		
	}  	else if (user === "Lola" && !value) {
		item.appendChild(document.createTextNode(inputLola.value));
		appendItemsBtns(listLola, item, btn, btn2);
		inputLola.value = "";
		lolaArray.push(item.childNodes[0].nodeValue);	// Push movie title to movie array
		
	}	else if (user === "Lola" && value) {
		item.appendChild(document.createTextNode(value));
		appendItemsBtns(listLola, item, btn, btn2);
	}				
}

// Remove deleted movie from corresponding array
// To fix - Movies of the same name are only deleted if deleted togther 
function removeMovie(list, arr) {
	let textContentArray = Array.from(list.children).map(node => node.firstChild.textContent);

	for(let i=0; i < arr.length; i++) {
		if(textContentArray.indexOf(arr[i]) === -1) { 
			arr.splice(i, 1);
			removeMovie(list, arr);
		}
	} return arr;
}

// Delete item from list
function deleteItem(e) {	
	e.target.parentNode.remove();
	removeMovie(listDanny, dannyArray);
	removeMovie(listLola, lolaArray);
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
			deleteItem(e, null);
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
			deleteItem(e, null);
			break;
		case 'btnClass2':
			approveItem(e, null);
			break;
		case 'btnClass2 btnClass-approve':
			approveItem(e, null);
			break;
	}
});

function hasContent(user) {

	if(user === "Danny" && inputDanny.value === "") {
		return inputDanny.placeholder = "Please enter a movie";
	
	} else if(user === "Danny" && inputDanny.value !== "") {
		addItem("Danny", null);
	
	} else if(user === "Lola" && inputLola.value === "") {
		return inputLola.placeholder = "Please enter a movie";
	
	} else {addItem("Lola", null);}
}

function clickFunk(e) {
	e.target.id === "btnDanny" ? hasContent("Danny") 
	: e.target.id === "btnLola" ? hasContent("Lola")
	: "";
}

function enterFunk(e) {
	e.keyCode === 13 && e.target.id === "inputDanny" ? hasContent("Danny") 
	: e.keyCode === 13 && e.target.id === "inputLola" ? hasContent("Lola")
	: ""; 
}

// Compare each list with saved stamp states and add stamp class
function assignStamps(list, stamps) {	
	const btns = Array.from(list.getElementsByClassName("btnClass2"));

	for(let i=0;i<btns.length;i++) {
		if(stamps[i] === true) {
			approveItem(null, btns[i]);
		}
	}
}

// Save current states of movie arrays and stamps
function saveFunk(state1, state2) {
		localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
		localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
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

window.onload = function() {
	dannyArray = Array.from(JSON.parse(localStorage.getItem('dannyMovies')));
	lolaArray = Array.from(JSON.parse(localStorage.getItem('lolaMovies')));
	
	// Add saved movie titles to lists
	dannyArray.forEach(movie => addItem("Danny", movie));
	lolaArray.forEach(movie => addItem("Lola", movie));

	const dannyStampStates = Array.from(JSON.parse(localStorage.getItem('dannyStamps')));
	const lolaStampStates = Array.from(JSON.parse(localStorage.getItem('lolaStamps')));
	
	// Add saved stamps to items
	assignStamps(listDanny, dannyStampStates);	
	assignStamps(listLola, lolaStampStates);
}

buttons.forEach(btn => btn.addEventListener('click', clickFunk));
inputs.forEach(input => input.addEventListener('keypress', enterFunk));
submit.addEventListener('click', isStampVisible);	// Save button
