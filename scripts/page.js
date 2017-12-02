//Globals

//Game window is composed of 10 by 14
var space_has_tunnel; // = new Array[11][14];this is 10 ground rows and the 0th row is the top of the ground

//standards
var STANDARD_SIZE = 30;
var MAX_BOARD_WIDTH = 16;
var MAX_BOARD_HEIGHT = 18;
//can only be between 0 to 10 for x and 0 to 13 for y
class coordinate_pair { 
	
	constructor() {
		this.x_coord = 0;
		this.y_coord = 0;
	};
};

class smurf {
	 constructor(){
	 	this.coordinates = new coordinate_pair();
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
var movement_cache_size = 0;
var movement_cache = new Array();
var n = 5;
for (var i = 0; i < n; i++){
    movement_cache.push(new coordinate_pair());
}



function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
	  if (!gameover) { createAlien(); }
      break;
    case KEYS.spacebar:
    // If you would like to add arrow button features
    break;
    case KEYS.left:
		add_to_movement_cache(smurf.coordinates.x_coord - 1, smurf.coordinates.y_coord);
		break;
    case KEYS.right:
		add_to_movement_cache(smurf.coordinates.x_coord + 1, smurf.coordinates.y_coord);
		break;
    case KEYS.up:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord - 1);
		break;
    case KEYS.down:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord + 1);
      	break;
    default:
      console.log("Invalid input!");
  }
}
	


//main
$(document).ready( function() { 

	smurf = new smurf();
	smurf.coordinates.x_coord = 7;
	smurf.coordinates.y_coord = 0;
	$('#smurf').css("top", smurf.coordinates.y_coord*STANDARD_SIZE);
	$('#smurf').css("left", smurf.coordinates.x_coord*STANDARD_SIZE);

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
		$(window).keydown(keydownRouter);
		 setInterval( function() {
			actuate_movement_cache();
		 }, 500);
		
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

});


//moves any character to a new space and removes wall
function move(character, x, y) { 


}

//check where smurf is and always moves closer
function alien_ai_move() { 

}

function create_tunnel(cp) { 
	//no tunnel
	if (space_has_tunnel[parseInt(cp.x_coord)][parseInt(cp.y_coord)] == false) { 
		var tunnel = `<img src="img/tunnel.png" class="tunnelclass" style="left:` + cp.x_coord*STANDARD_SIZE
					+ `;top:` + cp.y_coord*STANDARD_SIZE +`px;" width="30" height="30">`;
		$("#game-screen").append(tunnel);
		space_has_tunnel[parseInt(cp.x_coord)][parseInt(cp.y_coord)] = true;
	}//
}

function initialize_tunnels() { 

	for (let i = 1; i < 8; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = 7;
		tmp.y_coord = i;
		create_tunnel(tmp);
	}


	for(let i = 6; i < 14; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = 1;
		tmp.y_coord = i;
		create_tunnel(tmp);
	}

	for(let i = 9; i < 15; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = i;
		tmp.y_coord = 3;
		create_tunnel(tmp);
	}

	for(let i = 7; i < 14; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = i;
		tmp.y_coord = 15;
		create_tunnel(tmp);
	}

	for(let i = 6; i < 13; ++i) {
		let tmp = new coordinate_pair();
		tmp.x_coord = 12; 
		tmp.y_coord = i;
		create_tunnel(tmp);
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
	$('#smurf').css("top", y * 30 );
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


}

//empties one space for a tunnel
function clear_space() { 

}

//performs next movement in cache
function actuate_movement_cache() { 
	//no movement to perform
	if (movement_cache_size == 0) { 
		return;
	}
	else { 
		smurf_move(movement_cache[movement_cache_size - 1]);
		--movement_cache_size; //performed movement
	}
}

//adds movement to last empty element of cache
function add_to_movement_cache(x, y) { 
	var tmp = new coordinate_pair();
	tmp.x_coord = x;
	tmp.y_coord = y;
	
	//check if valid movement!

	if(x<0 || y<0 || x >= MAX_BOARD_WIDTH || y >= MAX_BOARD_HEIGHT){
		tmp.x_coord = 0;
		tmp.y_coord = 0;
		 //don't want negative values AKA him going off screen
		 return;
	}
	
	//don't make larger or will lag
	if (movement_cache_size == 5) { 
		movement_cache[5] = tmp;
	}
	//add to cache
	else { 
		movement_cache[movement_cache_size] = tmp;
		++movement_cache_size;
	}
}
