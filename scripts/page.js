//LinkedList implementation copied from thatjsdude.com
function LinkedList() {
	this.head = null;
	this.tailminusTwo = null;
}
LinkedList.prototype.push = function(val) {
	var node = {
		value: val,
		next: null
	}
	if(!this.head) {
		this.head = node;
	}
	else {
		current = this.head;
		while(current.next) {
			this.tailminusTwo = current;
			current = current.next;
		}
		current.next = node;
	}
}
LinkedList.prototype.delete_first_elt = function() {
	if(this.head.next != null) {
		this.head = this.head.next;
	}
}
LinkedList.prototype.length = function(){
	if(!this.head){
		return 0;
	}

	let counter1 = 1;
	let current1 = this.head;

	while(current1.next != null) {
			current1 = current1.next;
			counter1++;
	}

	return counter1;

}

//Globals
//Game window is composed of 10 by 14
var space_has_tunnel; // = new Array[11][14];this is 10 ground rows and the 0th row is the top of the ground
//standards
var STANDARD_SIZE = 30;
var MAX_BOARD_WIDTH = 16;
var MAX_BOARD_HEIGHT = 18;


var pooka1_steps;
var pooka2_steps;
var dragon1_steps;
var dragon2_steps;
var bullet_ptr;
var LEFT = 0;
var RIGHT = 1;
var UP = 2;
var DOWN = 3;
var num_lives = 3;
var num_points = 0;
var firstLife = true;


function modifyEnemyMovement(keyDirection){
	//pooka1's length represent all
		console.log("MODIFY STUFF");
		console.log(dragon1_steps.length());
		console.log(keyDirection);
	if (dragon1_steps.length() > 3) {
		if(keyDirection == KEYS.left && smurf.direction == RIGHT){
			console.log("LEFT RIGHT THING HAPPENED");
			pooka1_steps.tailminusTwo = null;
			pooka2_steps.tailminusTwo = null;
			dragon1_steps.tailminusTwo = null;
			dragon2_steps.tailminusTwo = null;
		}

		else if(keyDirection == KEYS.right && smurf.direction == LEFT){
			pooka1_steps.tailminusTwo = null;
			pooka2_steps.tailminusTwo = null;
			dragon1_steps.tailminusTwo = null;
			dragon2_steps.tailminusTwo = null;
		}

		else if(keyDirection == KEYS.up && smurf.direction == DOWN){
			pooka1_steps.tailminusTwo = null;
			pooka2_steps.tailminusTwo = null;
			dragon1_steps.tailminusTwo = null;
			dragon2_steps.tailminusTwo = null;
		}

		else if(keyDirection == KEYS.down && smurf.direction == UP){
			pooka1_steps.tailminusTwo = null;
			pooka2_steps.tailminusTwo = null;
			dragon1_steps.tailminusTwo = null;
			dragon2_steps.tailminusTwo = null;
		}

	}

}

class bullet {
	constructor(coord_pair, direction) {
		this.coord_pair = new coordinate_pair(coord_pair.x_coord, coord_pair.y_coord);
		this.direction = direction;
	}
};
//can only be between 0 to 10 for x and 0 to 13 for y
class coordinate_pair { 
	
	constructor(x,y) {
		this.x_coord = x;
		this.y_coord = y;
	};
};

class Smurf {
	 constructor(){
	 	this.coordinates = new coordinate_pair();
	 	this.direction = RIGHT;
	 };
};

class enemy { 
	constructor(){
		this.coordinates = new coordinate_pair();
		this.type; //dragon or orange midget
	};
};

var KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
}

//this records all the keystrokes of a user
var movement_cache = new Array();
var n = 3;



function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
	  if (!gameover) { }
      break;
    case KEYS.spacebar:
    // If you would like to add arrow button features
    	addBullet();
    	break;
    break;
    case KEYS.left:
		add_to_movement_cache(smurf.coordinates.x_coord - 1, smurf.coordinates.y_coord);
		modifyEnemyMovement(KEYS.left);
		changeDirection(LEFT);
		break;
    case KEYS.right:
		add_to_movement_cache(smurf.coordinates.x_coord + 1, smurf.coordinates.y_coord);
		modifyEnemyMovement(KEYS.right);
		changeDirection(RIGHT);
		break;
    case KEYS.up:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord - 1);
		modifyEnemyMovement(KEYS.up);
		changeDirection(UP);
		break;
    case KEYS.down:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord + 1);
		modifyEnemyMovement(KEYS.down);
		changeDirection(DOWN);
      		break;
    default:
      console.log("Invalid input!");
  }
}
	
//main
$(document).ready(function(){
	$("#score-box").html(num_points);
	$("#lives").html(num_lives);
	initializeGame();
	firstLife = false;

}); 



function initializeGame(){ 


smurf = new Smurf();
smurf.coordinates.x_coord = 7;
smurf.coordinates.y_coord = 1;
$('#smurf').css("top", smurf.coordinates.y_coord*STANDARD_SIZE);
$('#smurf').css("left", smurf.coordinates.x_coord*STANDARD_SIZE);
pooka1_steps = new LinkedList();
pooka2_steps = new LinkedList();
dragon1_steps = new LinkedList();
dragon2_steps = new LinkedList();

//initialize bullet ptr as null
bullet_ptr = null;

//intialize tunnel array
if(firstLife){
	space_has_tunnel = new Array(MAX_BOARD_HEIGHT);
	for (var row1 = 0; row1 < MAX_BOARD_WIDTH; row1++) { 
		space_has_tunnel[row1] = new Array(MAX_BOARD_WIDTH);
		for (var col1 = 0; col1 < MAX_BOARD_HEIGHT; col1++) { 	
			//first row never has a tunnel
			if (0 == col1) { 
				space_has_tunnel[row1][col1] = true;
			}
			else { 
				space_has_tunnel[row1][col1] = false;
			}
		}
	}

	var block = ""

	for ( var row = 1; row < MAX_BOARD_HEIGHT; row++) {
		for( var col = 0 ; col < MAX_BOARD_WIDTH ; col++ ){
		
			block = "<img class='blocks' style='left:" + col*30 + ";top:" + ((row*STANDARD_SIZE + 30)) + "' src='";
			
			//add smurf
			if (1 == row && 7 == col) { 
				let smurf_guy = `<img src="img/character_walk.png" style="left:` + col*30 
														+ `;top:30px;" id="smurf" width="30" height="30">`;
				$("#game-screen").append(smurf_guy);
			}

			if (row <=3) { //yellow
				block += "img/ground_yellow.png" + "'>";
			}
			//middle tier
			else if (row - 3 <= 3) { //orange
			block += "img/ground_orange.png" + "'>";


			}
			//bottom tier
			else { //red
			block += "img/ground_red.png" + "'>";

			}
		
			console.log(row);
			console.log(col);
			console.log(block);
			$("#game-screen").append(block);
		} //col
		//append to div
		console.log("HERE!");
		console.log(row);
		console.log(col);
	} //row

	initialize_tunnels();
	initializeRocks();
}



initializeEnemies();

//Pooka 1 initializing linked list
for(let j = 12; j > 4; j--) {
	let tmp = new coordinate_pair(5, j);
	pooka1_steps.push(tmp);
}
pooka1_steps.push(new coordinate_pair(6, 5));
pooka1_steps.push(new coordinate_pair(7, 5));

//Pooka 2 initializing linked list
for(let j = 12; j > 4; j--) {
	let tmp = new coordinate_pair(13, j);
	pooka2_steps.push(tmp);
}
for(let j = 12; j >= 7; j--) {
	let tmp = new coordinate_pair(j,5);
	pooka2_steps.push(tmp);
}

//Dragon 1 initializing linked list
dragon1_steps.push(new coordinate_pair(6, 5));
dragon1_steps.push(new coordinate_pair(7, 5));

//Dragon 2 initializing linked list
for(let j = 12; j >= 7; j--) {
	let tmp = new coordinate_pair(j,5);
	dragon2_steps.push(tmp);
}

for(let j = 4; j > 0; j--) {
	pooka1_steps.push(new coordinate_pair(7, j));
	pooka2_steps.push(new coordinate_pair(7, j));
	dragon1_steps.push(new coordinate_pair(7, j));
	dragon2_steps.push(new coordinate_pair(7, j));
}
if(firstLife){
	$(window).keydown(keydownRouter);
		setInterval( function() {
		actuate_movement_cache();
		checkIfKilledEnemies();
		if ($('#pooka1').length != 0) {
			check_if_killed(parseInt($("#pooka1").css('left')) , parseInt($("#pooka1").css('top')));
		}
		if ($('#pooka2').length != 0) {
			check_if_killed(parseInt($("#pooka2").css('left')) , parseInt($("#pooka2").css('top')));
	
		}
		if ($('#dragon1').length != 0) {
			check_if_killed(parseInt($("#dragon1").css('left')) , parseInt($("#dragon1").css('top')));
		
		}
		if ($('#dragon2').length != 0) {		
			check_if_killed(parseInt($("#dragon2").css('left')) , parseInt($("#dragon2").css('top')));		
		}
		
	}, 200);

	$(window).keydown(keydownRouter);
		setInterval( function() {
		move();
		checkIfKilledEnemies();
		if ($('#pooka1').length != 0) {
			check_if_killed(parseInt($("#pooka1").css('left')) , parseInt($("#pooka1").css('top')));
		}
		if ($('#pooka2').length != 0) {
			check_if_killed(parseInt($("#pooka2").css('left')) , parseInt($("#pooka2").css('top')));
	
		}
		if ($('#dragon1').length != 0) {
			check_if_killed(parseInt($("#dragon1").css('left')) , parseInt($("#dragon1").css('top')));
		
		}
		if ($('#dragon2').length != 0) {		
			check_if_killed(parseInt($("#dragon2").css('left')) , parseInt($("#dragon2").css('top')));		
		}
	}, 500);

	$(window).keydown(keydownRouter);
		setInterval(function() {
			moveBullet();
	}, 300);

	$(window).keydown(keydownRouter);
		setInterval(function() {
		


	}, 200);
}	

}
function check_if_killed(css_left_enemy, css_top_enemy) {
	let x_smurf = smurf.coordinates.x_coord;
	let y_smurf = smurf.coordinates.y_coord;
	let x_enemy = (css_left_enemy - (css_left_enemy % STANDARD_SIZE))/STANDARD_SIZE;
	let y_enemy = (css_top_enemy - (css_top_enemy % STANDARD_SIZE))/STANDARD_SIZE;

	if (0 == (x_smurf - x_enemy) && 0 == (y_smurf-y_enemy)) { 
		num_lives--;
		$("#lives").html(num_lives);
		$('#pooka1').remove();
		$('#pooka2').remove();
		$('#dragon1').remove();
		$('#dragon2').remove();
		check_game_over();
		initializeGame();

	}
}

function check_game_over() {
	alert("Game Over");
	$("#game-over").show();
	$("#game-screen").hide();
	$("#final-score").html(num_points);
}


//changes direction in which the smurf is pointing
function changeDirection(dir) {

	//direction of smurf is left
	if(dir == LEFT) {
	 	$("#smurf").attr('src', 'img/character_walk_left.png');
	}
	//direction of smurf is right
	if(dir == RIGHT) {
	 	$("#smurf").attr('src', 'img/character_walk.png');
	}
	//direction of smurf is upwards
	if(dir == UP) {
	 	$("#smurf").attr('src', 'img/character_walk_up.png');
	 }
	 //direction of smurf is downwards
	 if(dir == DOWN) {
	 	$("#smurf").attr('src', 'img/character_walk_down.png');
	 }
	 smurf.direction = dir; //sets the smurf's new direction
};

function enemyThere(x_next, y_next, enemy_looking) { 
	

	if (enemy_looking != "pooka1" && (parseInt($('#pooka1').css('left')) == x_next) 
							&& (parseInt($('#pooka1').css('top')) == y_next))  { 
		console.log("true pooka1");
		return true;
	}
	if (enemy_looking != "pooka2" && (parseInt($('#pooka2').css('left')) == x_next) 
							&& (parseInt($('#pooka2').css('top')) == y_next))  { 
		console.log("true pooka2");
		return true;
	}
	if (enemy_looking != "dragon1" && (parseInt($('#dragon1').css('left')) == x_next) 
							&& (parseInt($('#dragon1').css('top')) == y_next))  { 
		console.log("true dragon1");
		return true;
	}
	if (enemy_looking != "dragon2" && (parseInt($('#dragon2').css('left')) == x_next) 
							&& (parseInt($('#dragon2').css('top')) == y_next))  { 
		console.log("true dragon2");
		return true;
	}
	return false;
}

//moves any character to a new space and removes wall
function move() {

	//updates coordinates of pooka 1 
	let coords = pooka1_steps.head;
	//don't move if enemy there
	if ($('#pooka1').length != 0 && !enemyThere(coords.value.x_coord*STANDARD_SIZE, coords.value.y_coord*STANDARD_SIZE, "pooka1")) {
		$( "#pooka1" ).animate({
	    	top: coords.value.y_coord * STANDARD_SIZE,
	    	left: coords.value.x_coord * STANDARD_SIZE
	  	}, 500);
	  	pooka1_steps.delete_first_elt();
	  	check_if_killed(coords.value.x_coord, coords.value.y_coord);
	  }

  	coords = pooka2_steps.head;

  	if ($('#pooka2').length != 0 && !enemyThere(coords.value.x_coord*STANDARD_SIZE, coords.value.y_coord*STANDARD_SIZE, "pooka2") ) {

	  	$( "#pooka2" ).animate({
	    	top: coords.value.y_coord * STANDARD_SIZE,
	    	left: coords.value.x_coord * STANDARD_SIZE
	  	}, 500);
	  	pooka2_steps.delete_first_elt();
		check_if_killed(coords.value.x_coord, coords.value.y_coord);
	}

	coords = dragon1_steps.head;
	if ($('#dragon1').length != 0 && 
				!enemyThere(coords.value.x_coord*STANDARD_SIZE, coords.value.y_coord*STANDARD_SIZE, "dragon1")) {

	  	$( "#dragon1" ).animate({
	    	top: coords.value.y_coord * STANDARD_SIZE,
	    	left: coords.value.x_coord * STANDARD_SIZE
	  	}, 500);
		dragon1_steps.delete_first_elt();
		check_if_killed(coords.value.x_coord, coords.value.y_coord);
	}
	coords = dragon2_steps.head;
	if ($('#dragon2').length != 0 && !enemyThere( coords.value.x_coord*STANDARD_SIZE, coords.value.y_coord*STANDARD_SIZE, "dragon2")) {

	  	$( "#dragon2" ).animate({
	    	top: coords.value.y_coord * STANDARD_SIZE,
	    	left: coords.value.x_coord * STANDARD_SIZE
	  	}, 500);
	  	dragon2_steps.delete_first_elt();
		check_if_killed(coords.value.x_coord, coords.value.y_coord);
	}
}

//Get total number of lives for smurf
function getNumLives() {
	return num_lives;
}

//Get total number of points earned
function getTotalPoints() {
	return num_points;
}

//Add points for each points the player earns through making a tunnel or attacking an enemy
function addPoints(points) {
	num_points += points;
}

//check where smurf is and always moves closer
function alien_ai_move() { 

}

function create_tunnel(cp) { 
	//no tunnel
	if (space_has_tunnel[parseInt(cp.x_coord)][parseInt(cp.y_coord)] == false) { 
		var tunnel = `<img src="img/tunnel.png" class="tunnelclass" style="left:` + cp.x_coord*STANDARD_SIZE
					+ `;top:` + cp.y_coord*STANDARD_SIZE +`px;">`;
		$("#game-screen").append(tunnel);
		space_has_tunnel[parseInt(cp.x_coord)][parseInt(cp.y_coord)] = true;
	}
}

function initialize_tunnels() { 

	for (let i = 5; i <= 13; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = 5;
		tmp.y_coord = i;
		create_tunnel(tmp);
	}


	for(let i = 5; i <= 13; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = 13;
		tmp.y_coord = i;
		create_tunnel(tmp);
	}

	for(let i = 6; i < 13; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = i;
		tmp.y_coord = 5;
		create_tunnel(tmp);
	}

	for(let i = 6; i < 13; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = i;
		tmp.y_coord = 13;
		create_tunnel(tmp);
	}
	for(let i = 1; i < 8; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = 7;
		tmp.y_coord = i;
		create_tunnel(tmp);
	}
}

function initializeEnemies() {
	var dragon1 = `<img src="img/Fygar_Main_Screen.png" class="dragonclass" id="dragon1" style="left:` + 150
					+ `px;top:` + 150 +`px;">`;
	$("#game-screen").append(dragon1);
	var dragon2 = `<img src="img/Fygar_Main_Screen.png" class="dragonclass" id="dragon2" style="left:` + 390
					+ `px;top:` + 150 +`px;">`;

	$("#game-screen").append(dragon2);
	var pooka1 = `<img src="img/Pooka_Main_Screen.png" class="pookaclass" id="pooka1" style="left:` + 150
					+ `px;top:` + 390 +`px;">`;
	$("#game-screen").append(pooka1);
	var pooka2 = `<img src="img/Pooka_Main_Screen.png" class="pookaclass" id="pooka2" style="left:` + 390
					+ `px;top:` + 390 +`px;">`;
	$("#game-screen").append(pooka2);
}

function initializeRocks() {
	for(var i = 0; i < 16; i++) {
		var rock = `<img src="img/ground_darkred_rock.png" class="rockclass" style="left:` + 30*i
					+ `px;top:` + 510 +`px;">`;
		$("#game-screen").append(rock);
	}
	for(var i = 0; i < 16; i++) {
		var rock = `<img src="img/ground_darkred_rock.png" class="rockclass" style="left:` + 30*i
					+ `px;top:` + 540 +`px;">`;
		$("#game-screen").append(rock);
	}
}

//checks movement cache, if not empty, produces next movement
//ensures smurfs can't move faster than enemies
//called at an interval
//only fills up the movement cache so much otherwise there will be lag
function smurf_move(next_movement) {
	
	console.log(next_movement);

	let x = next_movement.x_coord;
	let y = next_movement.y_coord;
	
	//check if space is clear
	console.log("old top: " + $('#smurf').css("top"));
	console.log("old left: " + $('#smurf').css("left"));
	
	//move smurf to new position


	$('#smurf').css("top", y * 8 );
	$('#smurf').css("top", y * 15 );
	$('#smurf').css("top", y * 23 );
	$('#smurf').css("top", y * 30 );
	
	$('#smurf').css("left", x * 8 );
	$('#smurf').css("left", x * 15 );
	$('#smurf').css("left", x * 23 );
	$('#smurf').css("left", x * 30 );

	console.log("new top: " + $('#smurf').css("top"));
	console.log("new left: " + $('#smurf').css("left"));
	//update smurf coordinates
	smurf.coordinates.x_coord = x;
	smurf.coordinates.y_coord = y;

	//create tunnel behind image
	if (!space_has_tunnel[next_movement.x_coord][next_movement.y_coord]) { 
		num_points += 100;
		$("#score-box").html(num_points);
		create_tunnel(next_movement);
	}
	pooka1_steps.push(new coordinate_pair(x, y));
	pooka2_steps.push(new coordinate_pair(x, y));
	dragon1_steps.push(new coordinate_pair(x, y));
	dragon2_steps.push(new coordinate_pair(x, y));


}

//empties one space for a tunnel
function clear_space() { 

}

//performs next movement in cache
function actuate_movement_cache() { 
	//no movement to perform


	if (movement_cache.length == 0) { 
		return;
	}
	else { 

		var i = movement_cache.shift();
		smurf_move(i);
	}
}

//adds movement to last empty element of cache
function add_to_movement_cache(x, y) { 
	var tmp = new coordinate_pair();
	tmp.x_coord = x;
	tmp.y_coord = y;
	
	//check if valid movement!


	if(x < 0){
		tmp.x_coord = 0;
	}

	else if(y < 1){
		tmp.y_coord = 1;
	}

	else if (x >= MAX_BOARD_WIDTH){
		tmp.x_coord = MAX_BOARD_WIDTH - 1;
	}

	else if (y >= MAX_BOARD_HEIGHT - 1){
		tmp.y_coord = MAX_BOARD_HEIGHT - 2;
	}

	console.log("before: ");
	console.log(movement_cache);
	console.log(movement_cache.length);

	//don't make larger or will lag
	if (movement_cache.length == 1) {
		movement_cache[0] = tmp;
	}

	//add to cache
	else { 
		console.log("pushing");
		console.log(tmp);

		movement_cache.push(tmp);


		console.log("after: ");
		console.log(movement_cache);
		console.log(movement_cache.length);
	}

}

function addBullet() {
	//no bullet shot yet
	if (null == bullet_ptr) { 

		let bulletTMP = new bullet(new coordinate_pair(smurf.coordinates.x_coord, smurf.coordinates.y_coord), smurf.direction);
		bullet_ptr = bulletTMP;
			$('#bullet').attr('src', 'img/vertical_bullet.png');

		if((LEFT == smurf.direction) || (RIGHT == smurf.direction))	{

			$("#game-screen").append('<img id="bullet" class="bulletClass" style="top:' + smurf.coordinates.y_coord*STANDARD_SIZE + ';left:' +
			smurf.coordinates.x_coord*STANDARD_SIZE + ';" src="img/bullet.png">');
		}
		else{


			$("#game-screen").append('<img id="bullet" class="bulletClass" style="top:' + smurf.coordinates.y_coord*STANDARD_SIZE + ';left:' +
			smurf.coordinates.x_coord*STANDARD_SIZE + ';" src="img/vertical_bullet.png">');
		}
	}
}

function moveBullet() {
	//if a bullet is in the air
	if (bullet_ptr != null) { 
		let left_coords = parseInt($('#bullet').css('left'));
		let top_coords = parseInt($('#bullet').css('top'));
		if (bullet_ptr.direction == LEFT) { 
			//remove element
			if (left_coords - STANDARD_SIZE < 0 || !space_has_tunnel[(left_coords - STANDARD_SIZE)/STANDARD_SIZE][top_coords / STANDARD_SIZE]) { 
				$('#bullet').remove();
				bullet_ptr = null;
			}
			//move it over
			else { 
				$('#bullet').css('left', left_coords - STANDARD_SIZE);
			}
		}
		else if (bullet_ptr.direction == RIGHT) { 
		//remove element
			if ( (left_coords + STANDARD_SIZE > (MAX_BOARD_WIDTH-1)*STANDARD_SIZE)  || (!space_has_tunnel[(left_coords + STANDARD_SIZE)/STANDARD_SIZE][top_coords / STANDARD_SIZE]) ) { 
				$('#bullet').remove();
				bullet_ptr = null;
			}
			//move it over
			else { 
				$('#bullet').css('left', left_coords + STANDARD_SIZE);
			}
		}
		else if (bullet_ptr.direction == UP) { 
		//remove element
			if (top_coords - STANDARD_SIZE < 0 || (!space_has_tunnel[(left_coords)/STANDARD_SIZE][(top_coords - STANDARD_SIZE) / STANDARD_SIZE])) { 
				$('#bullet').remove();
				bullet_ptr = null;
			}
			//move it over
			else { 
				$('#bullet').css('top', top_coords - STANDARD_SIZE);
			}
		}
		else { //DOWN
		//remove element
			if (top_coords + STANDARD_SIZE > (MAX_BOARD_HEIGHT-1)*STANDARD_SIZE || (!space_has_tunnel[left_coords/STANDARD_SIZE][(top_coords + STANDARD_SIZE) / STANDARD_SIZE]) ) { 
				$('#bullet').remove();
				bullet_ptr = null;
			}
			//move it over
			else { 
				$('#bullet').css('top', top_coords + STANDARD_SIZE);
			}
		}
	}
	checkIfKilledEnemies();
}

function checkIfKilledEnemies() { 
	let bullet_coord_x = parseInt($('#bullet').css('left') );
	let bullet_coord_y = parseInt($('#bullet').css('top') );
	
	//bullet collides with enemy
	if ( (Math.abs(parseInt($("#pooka1").css("left")) - bullet_coord_x) < 20)
					&& Math.abs(parseInt($("#pooka1").css("top")) - bullet_coord_y) < 20) { 
		
		$("#pooka1").attr('src', 'img/explosion.png');
		setTimeout(function(){ $("#pooka1").remove(); }, 150);

		$('#bullet').remove();
	    bullet_ptr = null;
	}
		//bullet collides with enemy
	else if ( (Math.abs(parseInt($("#pooka2").css("left")) - bullet_coord_x) < 20)
					&& Math.abs(parseInt($("#pooka2").css("top")) - bullet_coord_y) < 20) { 

		$("#pooka2").attr('src', 'img/explosion.png');
		setTimeout(function(){ $("#pooka2").remove(); }, 150);

		$('#bullet').remove();
		bullet_ptr = null;
	}
		//bullet collides with enemy
	else if ( (Math.abs(parseInt($("#dragon1").css("left")) - bullet_coord_x) < 20)
					&& Math.abs(parseInt($("#dragon1").css("top")) - bullet_coord_y) < 20) { 
		$("#dragon1").attr('src', 'img/explosion.png');
		setTimeout(function(){ 

			$("#dragon1").css('visibility', 'hidden');
			$("#dragon1").remove();


		 }, 150);
		$('#bullet').remove();
				bullet_ptr = null;
	}
		//bullet collides with enemy
	else if ( (Math.abs(parseInt($("#dragon2").css("left")) - bullet_coord_x) < 20)
					&& Math.abs(parseInt($("#dragon2").css("top")) - bullet_coord_y) < 20) { 
		$("#dragon2").attr('src', 'img/explosion.png');
		setTimeout(function(){ $("#dragon2").remove(); }, 150);
		$('#bullet').remove();
				bullet_ptr = null;
	}	
}




