// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create({
    // gravity: Vector.create(0, 0)
});

// // create a renderer
// var render = Render.create({
//     element: document.body,
//     engine: engine
// });

// create two boxes and a ground
var boxA = Bodies.rectangle(200, 200, 80, 80);
var boxB = Bodies.rectangle(400, 100, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
let boxAToB = Constraint.create({
    length: 200,
    stiffness: 1,
    bodyA: boxA,
    pointA: Vector.create(0, 40),
    bodyB: boxB,
    pointB: Vector.create(0, -40)
});
let boxAToB2 = Constraint.create({
    length: 200,
    stiffness: 1,
    bodyA: boxA,
    pointA: Vector.create(0, -40),
    bodyB: boxB,
    pointB: Vector.create(0, 40)
});
let boxAToB3 = Constraint.create({
    length: 150,
    stiffness: 1,
    bodyA: boxA,
    pointA: Vector.create(40, 0),
    bodyB: boxB,
    pointB: Vector.create(-40, 0)
});
let boxAToB4 = Constraint.create({
    length: 250,
    stiffness: 1,
    bodyA: boxA,
    pointA: Vector.create(-40, 0),
    bodyB: boxB,
    pointB: Vector.create(40, 0)
});

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, boxAToB, boxAToB2, boxAToB3, boxAToB4]);

// // run the renderer
// Render.run(render);

let canvas;
let previousUpdateTime = Date.now();
(function run() {
    if (!canvas) {
        canvas = document.getElementsByTagName("canvas")[0];
    }
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    let currentTime = Date.now();

    // boxA.angle = boxB.angle = Vector.angle(Vector.sub(boxB.position, boxA.position), Vector.create(1, 0));
    Engine.update(engine, currentTime-previousUpdateTime);

    previousUpdateTime = currentTime;
    window.requestAnimationFrame(run);
})();

let highlightedBody = null;
// (function render() {
//     let bodies = Composite.allBodies(engine.world);
//     let constraints = Composite.allConstraints(engine.world);



//     context.fillStyle = '#fff';
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     context.beginPath();

//     for (let i = 0; i < bodies.length; i += 1) {
//         let vertices = bodies[i].vertices;

//         context.moveTo(vertices[0].x, vertices[0].y);

//         for (let j = 1; j < vertices.length; j += 1) {
//             context.lineTo(vertices[j].x, vertices[j].y);
//         }

//         context.lineTo(vertices[0].x, vertices[0].y);
//     }
//     context.stroke();

//     if (highlightedBody) {
        
//         context.beginPath();
//         context.fillStyle = "#07f";
//         let vertices = highlightedBody.vertices;

//         context.moveTo(vertices[0].x, vertices[0].y);

//         for (let j = 1; j < vertices.length; j += 1) {
//             context.lineTo(vertices[j].x, vertices[j].y);
//         }

//         context.lineTo(vertices[0].x, vertices[0].y);
//         context.fill();
//     }

//     context.beginPath();
//     for (let constraint of constraints) {
//         let bodyAPosition = Vector.add(constraint.bodyA.position, constraint.pointA);
//         let bodyBPosition = Vector.add(constraint.bodyB.position, constraint.pointB);
//         context.moveTo(bodyAPosition.x, bodyAPosition.y);
//         context.lineTo(bodyBPosition.x, bodyBPosition.y);
//     }
//     context.stroke();

    


//     context.lineWidth = 3;
//     context.strokeStyle = '#000';
//     context.stroke();
//     window.requestAnimationFrame(render);
// })();
let renderer = Matter.Render.create({element: document.body, engine: engine});
Matter.Render.run(renderer);

let shapeMode = "";
//toggle for sqaure button
const selectSquare = () => {
    
    shapeMode = "square";
};
//toggle for rectangle button
const selectRectangle = () => {

    shapeMode = "rectangle";
};
let redCircle;

function createRedCircle() {
    const x = Math.random() * (window.innerWidth - 60) + 30; // To keep it within bounds
    const y = Math.random() * (window.innerHeight - 60) + 30; // To keep it within bounds

    // Create a circle and add it to the world
    redCircle = Bodies.circle(x, y, 30, {
        isStatic: true, // Prevents it from being affected by gravity
        fillStyle: 'transparent', // No fill for the circle
        strokeStyle: 'red', // Set stroke (outline) color to red
        lineWidth: 5 // Set the outline thickness
    });

    Composite.add(engine.world, redCircle);
}

createRedCircle();
Matter.Events.on(engine, 'collisionStart', function (event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        if (pair.bodyA === redCircle || pair.bodyB === redCircle) {
            // If red circle collides with any body, reposition it
            repositionCircle();
        }
    });
});

// Function to reposition the red circle randomly
function repositionCircle() {
    const x = Math.random() * (window.innerWidth - 60) + 30; // To keep it within bounds
    const y = Math.random() * (window.innerHeight - 60) + 30; // To keep it within bounds

    // Update the position of the red circle
    Body.setPosition(redCircle, { x: x, y: y });
}

