function showVal(value) {
 console.log(value);
var sliderAngle = document.getElementById("myAngleRange");
//var angle = document.getElementById("AngleValue");
sliderAngle.value = value;
}

// extended method for changing slider value based on different slider id name etc.

var sliderAngle = document.getElementById("myAngleRange");
var angle = document.getElementById("AngleValue");
angle.innerHTML = sliderAngle.value; 
sliderAngle.oninput = function() {
  angle.innerHTML = this.value;
}

var sliderVelocity = document.getElementById("myVelocityRange");
var velo = document.getElementById("VelocityValue");
velo.innerHTML = sliderVelocity.value;

sliderVelocity.oninput = function() {
  velo.innerHTML = this.value;
}

function project(){
    document.getElementById('renderport').style.padding = "10px";
    document.getElementById('ftr').style.position = 'relative' ;
    


    // module aliases
var Engine = Matter.Engine,
        Events = Matter.Events,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Vector = Matter.Vector;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.getElementById('renderport'),
    engine: engine,
    options: {
        width: 1200,
        height: 500,
        //showVelocity: true,
        //showCollisions: true,
        
        background : '#0f0f13'
    }
});



//calculating horizontal and vertical velocity

var angle = $("#myAngleRange").val();
    angle=angle*(Math.PI)/180;

    var v= $("#myVelocityRange").val();
    vx=v*(Math.cos(angle)); 
    vy=-v*(Math.sin(angle));

    var coeffrst =$('#rst').val();


// create two bodies and a ground
// var boxA = Bodies.rectangle(200, 600, 40, 40);
//var ball1=Bodies.circle(50,440,30,{isStatic:true});
var ball = Bodies.circle(50,440, 30 , {friction: 0, frictionAir:0, restitution: coeffrst, inverseInertia: 0 });
var ground = Bodies.rectangle(400, 500, 2000, 60, {friction: 0, isStatic: true });

engine.world.gravity.y = 1;


Matter.Body.setVelocity(ball, {x:vx , y:vy});


// add all of the bodies to the world
World.add(engine.world, [ground, ball]);







//add trail



    var trail = [];

    Events.on(render, 'afterRender', function() {
        trail.unshift({
            position: Vector.clone(ball.position),
            speed: ball.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        for (var i = 0; i < trail.length; i += 1) {
            var point = trail[i].position,
                speed = trail[i].speed;
            
            var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
            render.context.fillRect(point.x, point.y, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trail.length > 2000) {
            trail.pop();
        }
    });


 // add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(engine.world, mouseConstraint);

render.mouse = mouse;




// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

}


