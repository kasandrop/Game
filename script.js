"use strict";

/*Game class - store the object and turn number, score from previous round - any other selected settings for the game
class game_control {
  constructor (maxscore, players) {
    this.maxscore = maxscore;
    this.currentplayer = 0;
    this.players = players;
    
  }
}*/

var players = [];
let penguinImg;
let backgroundImg;

function showVal(value, id) {
console.log(id, ": ", value);
}

// extended method for changing slider value based on different slider id name etc.

var sliderAngle = document.getElementById("myAngleRange");
var setAngle = document.getElementById("AngleValue")
setAngle.innerHTML = sliderAngle.value; 
sliderAngle.oninput = function() {
  setAngle.innerHTML = this.value;
}

var sliderVelocity = document.getElementById("myVelocityRange");
var velo = document.getElementById("VelocityValue");
velo.innerHTML = sliderVelocity.value;

sliderVelocity.oninput = function() {
  velo.innerHTML = this.value;
}

var vp_width = 920, vp_height = 690; //declare variables to hold the viewport size

//declare global variables to hold the framework objects
var viewport, world, engine, body;

var ground;
var ball;
var player1;
var player2;
var start = false;

//var coeffrst = document.getElementById("rst").value;

//class for creating player character and also stores scores/attributes for player etc.
class c_player {
  constructor(x, y, width, height, label) {
    let options = {
      isStatic: true,
      label: label,
    }
    this.body = Matter.Bodies.rectangle(x, y, width, height, options);
    Matter.World.add(world, this.body);
    players.push(this.body);
  	this.x = x; //store the passed variables in the object
    this.y = y;
		this.width = width;
		this.height = height;
    this.alive = true;
    this.score = 0;
	}

	body() {
		return this.body; //return the created body
	}
  	//dont forget bodies are added to the matter world meaning even if not visible the physics engine still manages it
	remove() {
		Matter.World.remove(world, this.body);
		//this.alive = false;
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		//rectMode(CENTER); //switch centre to be centre rather than left, top
		//fill('#ffffff'); //set the fill colour
		//rect(pos.x, pos.y, this.width, this.height); //draw the rectangle
    imageMode(CENTER);
    image(penguinImg, this.body.position.x, this.body.position.y, this.width, this.height);

	}
}
// class for creating ball body
class c_ball {
	constructor(x, y, diameter, label) {
		let options = {
			restitution: 0,
			friction: 0.005,
			density: 0.95,
			frictionAir: 0.005,
      label: label,
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
	}

	body() {
		return this.body;
	}

	//dont forget bodies are added to the matter world meaning even if not visible the physics engine still manages it
	remove() {
		Matter.World.remove(world, this.body);
		//this.alive = false;
	}

	show() {
		let pos = this.body.position;
		let angle = this.body.angle;

		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
			fill('#ffffff');
			ellipseMode(CENTER); //switch centre to be centre rather than left, top
			circle(0, 0, this.diameter);
		pop();
	}
}

//class for creating ground body template - stores methods for show etc.
class c_ground {
	constructor(x, y, width, height) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0,
			density: 0.99,
      label: "ground",
		}
		//create the body
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body); //add to the matter world
		
		this.x = x; //store the passed variables in the object
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body; //return the created body
	}

	show() {
		let pos = this.body.position; //create an shortcut alias 
		rectMode(CENTER); //switch centre to be centre rather than left, top
		fill('#ffffff'); //set the fill colour
		rect(pos.x, pos.y, this.width, this.height); //draw the rectangle
	}
}

function preload() {
	//p5 defined function
  penguinImg = loadImage('penguin.png');
  backgroundImg = loadImage('background.jpeg');
}

function initialiseGame() {
	ground = new c_ground(vp_width/2, vp_height-10, vp_width, 20);
  console.log(vp_width, " ", vp_height);
  player1 = new c_player(100, (vp_height-35), 30, 30, "player1");
  player2 = new c_player((vp_width-100), (vp_height-35), 30, 30, "player2"); 
}

function setup() {
	//this p5 defined function runs automatically once the preload function is done
	viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div

  //enable the matter engine
	engine = Matter.Engine.create();
	world = engine.world;
	body = Matter.Body;

  console.log(engine);


	initialiseGame(); //once the matter engine is invoked we can create our objects
  Matter.Events.on(engine, 'collisionEnd', collisions);

	frameRate(24);
}

function paint_background() {
	//access the game object for the world, use this as a background image for the game
	background(backgroundImg, width = vp_width, height = vp_height); 
}

function paint_assets() {
	ground.show();
  if (start) {
	  ball.show();
  };
  if (player1.alive) {
    player1.show();
  }
  if (player2.alive) {
    player2.show();
  };
}

function draw() {
	//this p5 defined function runs every refresh cycle
	Matter.Engine.update(engine); //run the matter engine update
  imageMode(CENTER);
  image(backgroundImg, vp_width/2, vp_height/2, vp_width, vp_height);
//	paint_background(); //paint the default background
	paint_assets();
  paint_scores(); //paint the assets
}

function paint_scores(){
  textSize(20);
  text(("Player 1: " + player1.score),100, 35);
  text(("Player 2: " + player2.score),(vp_width-200), 35);
}

var v;
var vx;
var vy;
var angle;


//sets a velocity according to players input of speed and angle and create a projectile
function apply_velocity() {
  
  angle = document.getElementById("myAngleRange").value;
  angle = angle*(Math.PI)/180;

  v = document.getElementById("myVelocityRange").value;
  vx = v*(Math.cos(angle)); 
  vy = -v*(Math.sin(angle));
  console.log(vx," + ", vy);
  Matter.Body.setVelocity(ball.body, {x:vx , y:vy});
   
};

function collisions(event) {
	//runs as part of the matter engine after the engine update, provides access to a list of all pairs that have ended collision in the current frame (if any)

	event.pairs.forEach((collide) => { //event.pairs[0].bodyA.label
		console.log(collide.bodyA.label + " - " + collide.bodyB.label);

    console.log("player 2 alive? ", player2.alive);
    console.log("player 1 alive? ", player1.alive);

		if((collide.bodyA.label == "ball" && collide.bodyB.label == "player2") || (collide.bodyA.label == "player2" && collide.bodyB.label == "ball")) {
      console.log("player 2 disappear");
      player2.alive = false;
			console.log("interesting collision");
      player1.score = player1.score + 1;
		}
    else if ((collide.bodyA.label == "ball" && collide.bodyB.label == "player1") || (collide.bodyA.label == "player1" && collide.bodyB.label == "ball"))
    {
      console.log("player 1 disappear");
      player1.alive = false;
			console.log("interesting collision");
      player2.score = player2.score + 1;
    }
	});
}

function ballOutside() {
  if (ball.body.position.x >= vp_width || ball.body.position.x <= 0 || ball.body.position.y <= ground.body.position.y) {
    return true;
    //get function to run every refresh cycle and change player turn
  }
}

function getBall() {
  let currentPlayer = players[0];
  let position = currentPlayer.position;
  console.log(position);
  if (currentPlayer.label == "player1") {
    console.log("changes position to near player 1");
    ball = new c_ball((position.x + 30), (vp_height-20), 10, "ball");
  } else {
    console.log("player 2 has ball now");
    ball = new c_ball((position.x - 30), (vp_height-20), 10,"ball");
  }
}


//runs when player clicks start after adjusting the values
function project(){
  console.log("start");
  console.log(players);
  if  (ball) {
    ball.remove();
  }
  getBall();
  player1.alive = true;
  player2.alive = true;
  start = true;
  var grav = document.getElementById("setGrav").value;
  engine.world.gravity.y = grav;
  //calculating horizontal and vertical velocity
  apply_velocity();
  console.log(ball);
  
  players.push(players.shift());
  console.log(players);
  console.log("ending a throw");
}


// get it to ignore first collision event