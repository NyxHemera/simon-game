var order = [];
var enteredKeys = [];
var touchdown = false;
var count = 0;
var currentState = 0;
var btnList = {
	"buttons":["#btn-1", "#btn-2", "#btn-3", "#btn-4"],
	"darkcolors":["#00a74a", "#9f0f17", "#cca707", "#094a8f"],
	"lightcolors":["#33DA7D", "#D2424A", "#FFDA3A", "#3C7DC2"],
	"frequency":[300, 250, 200, 150, 150]
};
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var osc = [];
var gain = [];
handleAudio();

var gameTimeStep = setInterval(gameLoop, 500);

function handleAudio() {
	var oscGreen = audioCtx.createOscillator();
	var oscRed = audioCtx.createOscillator();
	var oscYellow = audioCtx.createOscillator();
	var oscBlue = audioCtx.createOscillator();
	var oscErr = audioCtx.createOscillator();
	var gain1 = audioCtx.createGain();
	var gain2 = audioCtx.createGain();
	var gain3 = audioCtx.createGain();
	var gain4 = audioCtx.createGain();
	var gain5 = audioCtx.createGain();
	osc.push(oscGreen);
	osc.push(oscRed);
	osc.push(oscYellow);
	osc.push(oscBlue);
	osc.push(oscErr)
	gain.push(gain1);
	gain.push(gain2);
	gain.push(gain3);
	gain.push(gain4);
	gain.push(gain5);
	
	for(var i=0; i<gain.length; i++){
		gain[i].gain.value = 0;
		gain[i].connect(audioCtx.destination);
	}
	
	for(var i=0; i<osc.length; i++){
		osc[i].type = 'sine';
		osc[i].frequency.value = btnList.frequency[i];
		osc[i].connect(gain[i]);
		osc[i].start();
	}
	
	osc[4].type = 'square';
	
}

function gameLoop() {
	switch(currentState){
		case 1:
			//showstate
			console.log("in gameloop state: " + currentState);
			if(count === order.length){
				count = 0;
				currentState = 2;
			}else {
				playKeys();
			}
			break;
		case 2:
			//playstate
			console.log("in gameloop state: " + currentState);
			if(enteredKeys.length === order.length){
				enteredKeys = [];
				addKey(order);
				setCounter();
				currentState = 1;
			}
			break;
		case 3:
			break;
		default:
			console.log("in gameloop state: " + currentState);
			break;
	}
	
}

function addKey(arr, key) {
	if(key >= 0){
		//if you recieve a key, add this to the array
		arr.push(key);
	}else{
		//if not, add a random key between 1-4
		arr.push(Math.floor(Math.random() * 4));
	}
}	
function checkKeyEntered() {
	console.log("keys entered: "+enteredKeys);
	if(enteredKeys[enteredKeys.length-1] === order[enteredKeys.length-1]){
		//MATCH!
		console.log("keys match");
		return true;
	}else{
		//NO MATCH!
		console.log("keys don't match")
		reset();
		setCounter();
		currentState = 0;
		return false;
	}
}
function keyDown(key) {
	if(currentState === 2){
		addKey(enteredKeys, key)
		if(checkKeyEntered()){
			startSound(key);
			lightenColors(key);
		}else{
			lightenColors(key);
			startSound(4);
			setTimeout(function(){stopSound(4);}, 400);
		}
	}else{
		startSound(key);
		lightenColors(key);
	}
}
function keyUp(key) {
	stopSound(key);
	darkenColors(key);
}
function start() {
	reset();
	setCounter();
	currentState = 1;
}
function reset() {
	order = [];
	addKey(order);
	enteredKeys = [];
}
function playKeys() {
	var cBtn = order[count];
	
	lightenColors(cBtn);
	startSound(cBtn);
	
	setTimeout(function(){
		keyUp(cBtn);
	}, 400);
	
	count++;
}
function setCounter() {
	var counter = order.length-1;
	if(counter < 10){
		$('#count').text("0"+counter);
	}else{
		$('#count').text(counter);
	}
}
function lightenColors(num) {
	$(btnList.buttons[num]).css("background", btnList.lightcolors[num]);
}
function darkenColors(num) {
	$(btnList.buttons[num]).css("background", btnList.darkcolors[num]);
}
function startSound(num) {
	gain[num].gain.value = 0.4;
}
function stopSound(num) {
	gain[num].gain.value = 0.0;
}

$('#btn-1').bind('touchstart mousedown', function(event){
	if(event.type === 'touchstart'){
		touchdown = true;
		keyDown(0);
	}
	if(event.type === 'mousedown'){
		if(touchdown === false){
			keyDown(0);
		}else{
			touchdown = false;
		}
	}
});
$('#btn-1').bind('mouseup mouseleave touchend', function(){
	keyUp(0);
});
$('#btn-2').bind('touchstart mousedown', function(){
	if(event.type === 'touchstart'){
		touchdown = true;
		keyDown(1);
	}
	if(event.type === 'mousedown'){
		if(touchdown === false){
			keyDown(1);
		}else{
			touchdown = false;
		}
	}
});
$('#btn-2').bind('mouseup mouseleave touchend', function(){
	keyUp(1);
});
$('#btn-3').bind('touchstart mousedown', function(){
	if(event.type === 'touchstart'){
		touchdown = true;
		keyDown(2);
	}
	if(event.type === 'mousedown'){
		if(touchdown === false){
			keyDown(2);
		}else{
			touchdown = false;
		}
	}
});
$('#btn-3').bind('mouseup mouseleave touchend', function(){
	keyUp(2);
});
$('#btn-4').bind('touchstart mousedown', function(){
	if(event.type === 'touchstart'){
		touchdown = true;
		keyDown(3);
	}
	if(event.type === 'mousedown'){
		if(touchdown === false){
			keyDown(3);
		}else{
			touchdown = false;
		}
	}
});
$('#btn-4').bind('mouseup mouseleave touchend', function(){
	keyUp(3);
});
//disable right click
$('#container-game').on('contextmenu', 'div', function(e){ return false; });