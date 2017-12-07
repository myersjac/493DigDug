//LinkedList implementation copied from thatjsdude.com
function LinkedList() {
	this.head = null;
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

class smurf {
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
// for (let i = 0; i < n; i++){
//     movement_cache.push(new coordinate_pair());
// }



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
		changeDirection(LEFT);
		break;
    case KEYS.right:
		add_to_movement_cache(smurf.coordinates.x_coord + 1, smurf.coordinates.y_coord);
		changeDirection(RIGHT);
		break;
    case KEYS.up:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord - 1);
		changeDirection(UP);
		break;
    case KEYS.down:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord + 1);
		changeDirection(DOWN);
      		break;
    default:
      console.log("Invalid input!");
  }
}
	


//main
$(document).ready( function() { 

	smurf = new smurf();
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
	

	//game begins
	// $("#start-button").click({
		
	// });
    

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
	initializeEnemies();
	initializeRocks();

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
	$(window).keydown(keydownRouter);
		setInterval( function() {
		actuate_movement_cache();
		// move();
	}, 200);

	$(window).keydown(keydownRouter);
		setInterval( function() {
		move();
	}, 500);

	$(window).keydown(keydownRouter);
		setInterval(function() {
			moveBullet();
	}, 300);
	
	$("#back-btn").click(function() {
		$("#game-over").show().hide();
		$("#game-screen").show().hide();
		$("#main-screen").hide().show();
	});	
});

function check_if_killed(x_enemy, y_enemy) {
	let x = smurf.coordinates.x_coord;
	let y = smurf.coordinates.y_coord;
	if (0 == (x - x_enemy) && 0 == (y-y_enemy)) { 
	//	alert('killed');
		console.log('killed');
	}
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

//moves any character to a new space and removes wall
function move() {

	//updates coordinates of pooka 1 
	let coords = pooka1_steps.head;
	$("#pooka1").css("left", (coords.value.x_coord * STANDARD_SIZE));
	$("#pooka1").css("top", (coords.value.y_coord * STANDARD_SIZE));
	pooka1_steps.delete_first_elt();
	// console.log("Pooka 1 x: " + (coords.value.x_coord * STANDARD_SIZE));
	// console.log("Pooka 1 y: " + (coords.value.y_coord * STANDARD_SIZE));
	check_if_killed(coords.value.x_coord, coords.value.y_coord);

	coords = pooka2_steps.head;
	$("#pooka2").css("left", (coords.value.x_coord * STANDARD_SIZE));
	$("#pooka2").css("top", (coords.value.y_coord * STANDARD_SIZE));
	pooka2_steps.delete_first_elt();
	// console.log("Pooka 2 x: " + (coords.value.x_coord * STANDARD_SIZE));
	// console.log("Pooka 2 y: " + (coords.value.y_coord * STANDARD_SIZE));
	check_if_killed(coords.value.x_coord, coords.value.y_coord);

	coords = dragon1_steps.head;
	$("#dragon1").css("left", (coords.value.x_coord * STANDARD_SIZE));
	$("#dragon1").css("top", (coords.value.y_coord * STANDARD_SIZE));
	dragon1_steps.delete_first_elt();
	// console.log("Dragon 1 x: " + (coords.value.x_coord * STANDARD_SIZE));
	// console.log("Dragon 1 y: " + (coords.value.y_coord * STANDARD_SIZE));
	check_if_killed(coords.value.x_coord, coords.value.y_coord);

	coords = dragon2_steps.head;
	$("#dragon2").css("left", (coords.value.x_coord * STANDARD_SIZE));
	$("#dragon2").css("top", (coords.value.y_coord * STANDARD_SIZE));
	dragon2_steps.delete_first_elt();
	check_if_killed(coords.value.x_coord, coords.value.y_coord);

	// console.log("Dragon 2 x: " + (coords.value.x_coord * STANDARD_SIZE));
	// console.log("Dragon 2 y: " + (coords.value.y_coord * STANDARD_SIZE));

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


	if(x <= 0){
		tmp.x_coord = 0;
	}

	else if(y < 1){
		tmp.y_coord = 1;
	}

	else if (x >= MAX_BOARD_WIDTH){
		tmp.x_coord = MAX_BOARD_WIDTH - 1;
	}

	else if (y >= MAX_BOARD_HEIGHT){
		tmp.y_coord = MAX_BOARD_HEIGHT - 1;
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
		if(smurf.direction == LEFT || smurf.direction == RIGHT) {
			let bulletTMP = new bullet(new coordinate_pair(smurf.coordinates.x_coord, smurf.coordinates.y_coord), smurf.direction);
			bullet_ptr = bulletTMP;
			$("#game-screen").append('<img id="bullet" class="bulletClass" style="top:' + smurf.coordinates.y_coord*STANDARD_SIZE + ';left:' +
			smurf.coordinates.x_coord*STANDARD_SIZE + ';" src="img/bullet.png">');
		}
		if(smurf.direction == UP || smurf.direction == DOWN) {
			let bulletTMP = new bullet(new coordinate_pair(smurf.coordinates.x_coord, smurf.coordinates.y_coord), smurf.direction);
			bullet_ptr = bulletTMP;
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
			if (left_coords - STANDARD_SIZE < 0) { 
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
			if (left_coords + STANDARD_SIZE > (MAX_BOARD_WIDTH-1)*STANDARD_SIZE) { 
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
			if (top_coords - STANDARD_SIZE < 0) { 
				$('#bullet').remove();
				bullet_ptr = null;
			}
			//move it over
			else { 
				$('#bullet').css('top', top_coords - STANDARD_SIZE);
			}
		}
		else { 
		//remove element
			if (top_coords + STANDARD_SIZE > (MAX_BOARD_HEIGHT-1)*STANDARD_SIZE) { 
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
	let bullet_coord_x = $('#bullet').css('left');
	let bullet_coord_y = $('#bullet').css('top');
	
	//bullet collides with enemy
	if ($("#pooka1").css("left") == bullet_coord_x 
					&& $("#pooka1").css("top") == bullet_coord_y) { 
		$("#pooka1").remove();
		$('#bullet').remove();
	    bullet_ptr = null;
	}
		//bullet collides with enemy
	if ($("#pooka2").css("left") == bullet_coord_x 
					&& $("#pooka2").css("top") == bullet_coord_y) { 
		$("#pooka2").remove();
		$('#bullet').remove();
		bullet_ptr = null;
	}
		//bullet collides with enemy
	if ($("#dragon1").css("left") == bullet_coord_x 
					&& $("#dragon1").css("top") == bullet_coord_y) { 
		$("#dragon1").remove();	
		$('#bullet').remove();
				bullet_ptr = null;
	}
		//bullet collides with enemy
	if ($("#dragon2").css("left") == bullet_coord_x 
					&& $("#dragon2").css("top") == bullet_coord_y) { 
		$("#dragon2").remove();	
		$('#bullet').remove();
				bullet_ptr = null;
	}
	
}




