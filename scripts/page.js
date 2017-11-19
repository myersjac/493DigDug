//Globals

//Game window is composed of 10 by 14
// var space_has_tunnel[11][14];//this is 10 ground rows and the 0th row is the top of the ground

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
    case KEYS.left:
		add_to_movement_cache(smurf.coordinates.x_coord - 1, smurf.coordinates.y_coord);
    case KEYS.right:
		add_to_movement_cache(smurf.coordinates.x_coord + 1, smurf.coordinates.y_coord);
    case KEYS.up:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord + 1);
    case KEYS.down:
		add_to_movement_cache(smurf.coordinates.x_coord, smurf.coordinates.y_coord - 1);
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
	$('#smurf').css("top", smurf.coordinates.y_coord*75 );
	$('#smurf').css("left", smurf.coordinates.x_coord*75 );



	//game begins
	// $("#start-button").click({
		$(window).keydown(keydownRouter);
		 setInterval( function() { 
			actuate_movement_cache();
		 }, 500);
		
	// });

});


//moves any character to a new space and removes wall
function move(character, x, y) { 


}

//check where smurf is and always moves closer
function alien_ai_move() { 


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
	
	//move smurf to new position
	$('#smurf').css("top", y*75 );
	$('#smurf').css("left", x*75 );
	smurf.coordinates.x_coord = x;
	smurf.coordinates.y_coord = y;


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
		smurf_move(movement_cache[movement_cache_size]);
		--movement_cache_size; //performed movement
	}
}

//adds movement to last empty element of cache
function add_to_movement_cache(x, y) { 
	var tmp = new coordinate_pair();
	tmp.x_coord = x;
	tmp.y_coord = y;
	
	//check if valid movement!
	
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







