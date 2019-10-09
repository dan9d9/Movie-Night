//Hello
const inputDanny = document.getElementById('inputDanny');
const inputLola =  document.getElementById('inputLola');
const listDanny = document.getElementById('listDanny');
const listLola = document.getElementById('listLola');
const buttons = document.querySelectorAll('button');
const inputs = Array.from(document.getElementsByClassName('input'));
const submit = document.getElementById('submitBtn');
const listMovies = listDanny.getElementsByTagName('div');

//Arrays to store movies
let dannyArray = [];
let lolaArray = [];


function approveMovie(e) {	
	
	if(e.target.parentElement.parentElement.id === "listDanny") {
		e.target.innerText = "Lola approved!";
		if(e.target.className ==='approvedHidden') {
			e.target.className = 'approvedVisible';
		} else {e.target.className = 'approvedHidden';}	
	}

	if(e.target.parentElement.parentElement.id === "listLola") {
		e.target.innerText = "Danny approved!";
		if(e.target.className ==='approvedHidden') {
			e.target.className = 'approvedVisible';
		} else {e.target.className = 'approvedHidden';}
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

function createStamp() {
	let stamp = document.createElement('div');
	stamp.className = 'approvedHidden';
	return stamp;
}

function createBtn() {
	let btn = document.createElement('button');
	btn.className = 'btnClass';
	btn.appendChild(document.createTextNode('X'));
	return btn;
}
function createItem() {
	let item = document.createElement('li');
 	item.className = 'itemClass';
 	return item;
}

function addItem(user, value) {

 	let item = createItem();

 	let btn = createBtn();	

 	let stamp = createStamp();
	
	if (user === "Danny" && !value) {
		item.appendChild(document.createTextNode(inputDanny.value));
		listDanny.appendChild(item);
		item.appendChild(stamp);
		item.appendChild(btn);
		inputDanny.value = "";		
		dannyArray.push(item.childNodes[0].nodeValue);

	}  	else if (user === "Danny" && value) {
			item.appendChild(document.createTextNode(value));
			listDanny.appendChild(item);
			item.appendChild(stamp);
			item.appendChild(btn);
				
	}  	else if (user === "Lola" && !value) {
			item.appendChild(document.createTextNode(inputLola.value));
			listLola.appendChild(item);
			item.appendChild(stamp);
			item.appendChild(btn);
			inputLola.value = "";
			lolaArray.push(item.childNodes[0].nodeValue);

	}	else if (user === "Lola" && value) {
			item.appendChild(document.createTextNode(value));
			listLola.appendChild(item);
			item.appendChild(stamp);
			item.appendChild(btn);
		}				
}

listDanny.addEventListener('click', function(e){
	switch (e.target.nodeName){
		case 'BUTTON':
			deleteItem(e);
			break;
		case 'DIV':
			approveMovie(e);
			break;
	}
});

listLola.addEventListener('click', function(e){
	switch (e.target.nodeName){
		case 'BUTTON':
			deleteItem(e);
			break;
		case 'DIV':
			approveMovie(e);
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

// Save current states of movie arrays and stamps
function saveFunk(state1, state2) {
		localStorage.setItem('dannyMovies', JSON.stringify(dannyArray));
		localStorage.setItem('lolaMovies', JSON.stringify(lolaArray));
		localStorage.setItem('dannyStates', JSON.stringify(state1));
		localStorage.setItem('lolaStates', JSON.stringify(state2));
	}

//Compare each list with saved stamp state - 'click' corresponding movie to activate stamp
function assignStamps(list, stamps) {	
	const divs = Array.from(list.getElementsByTagName("div"))
	for(let i=0;i<divs.length;i++) {
		if(stamps[i] === true) {
			triggerEvent( divs[i], 'click' );
		}
	}
}

// Artificial 'click' event
function triggerEvent( elem, event ) {	
  var clickEvent = new Event( event ); // Create the event.
  elem.dispatchEvent( clickEvent );    // Dispatch the event.
}

// Record states of stamps and pass to save function
function isStampVisible() {
	const dannyStampStates = Array.from(listDanny.getElementsByTagName("div"))
						.map(node => node.classList)
						.map(node => node.value)
						.map(item => item.includes('approvedVisible'));

	const lolaStampStates = Array.from(listLola.getElementsByTagName("div"))
						.map(node => node.classList)
						.map(node => node.value)
						.map(item => item.includes('approvedVisible'));

	saveFunk(dannyStampStates, lolaStampStates);
}

window.onload = function() {
	dannyArray = Array.from(JSON.parse(localStorage.getItem('dannyMovies')));
	lolaArray = Array.from(JSON.parse(localStorage.getItem('lolaMovies')));
	dannyArray.forEach(movie => addItem("Danny", movie));
	lolaArray.forEach(movie => addItem("Lola", movie));

	dannyStampStates = Array.from(JSON.parse(localStorage.getItem('dannyStates')));
	lolaStampStates = Array.from(JSON.parse(localStorage.getItem('lolaStates')));
	
	assignStamps(listDanny, dannyStampStates);	
	assignStamps(listLola, lolaStampStates);
}

buttons.forEach(btn => btn.addEventListener('click', clickFunk));
inputs.forEach(input => input.addEventListener('keypress', enterFunk));
submit.addEventListener('click', isStampVisible);
