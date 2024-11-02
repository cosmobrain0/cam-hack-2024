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
var engine = Engine.create();

// // create a renderer
// var render = Render.create({
//     element: document.body,
//     engine: engine
// });

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
let boxAToB = Constraint.create({
    length: 200,
    stiffness: 0.001,
    bodyA: boxA,
    bodyB: boxB,
});

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, boxAToB]);

// // run the renderer
// Render.run(render);

let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

document.body.appendChild(canvas);

(function run() {
    Engine.update(engine, 1000 / 60);
    window.requestAnimationFrame(run);
})();

(function render() {
    let bodies = Composite.allBodies(engine.world);
    let constraints = Composite.allConstraints(engine.world);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    for (let i = 0; i < bodies.length; i += 1) {
        let vertices = bodies[i].vertices;

        context.moveTo(vertices[0].x, vertices[0].y);

        for (let j = 1; j < vertices.length; j += 1) {
            context.lineTo(vertices[j].x, vertices[j].y);
        }

        context.lineTo(vertices[0].x, vertices[0].y);
    }
    context.stroke();

    context.beginPath();
    for (let constraint of constraints) {
        let bodyAPosition = constraint.bodyA.position;
        let bodyBPosition = constraint.bodyB.position;
        context.moveTo(bodyAPosition.x, bodyAPosition.y);
        context.lineTo(bodyBPosition.x, bodyBPosition.y);
    }
    context.stroke();


    context.lineWidth = 3;
    context.strokeStyle = '#000';
    context.stroke();
    window.requestAnimationFrame(render);
})();

const selectSquare = () => {
    let positionX = Math.random()*canvas.width;
    let positionY = Math.random()*canvas.height;
    Composite.add(engine.world, Bodies.rectangle(positionX, positionY, 50, 50));
};

const selectRectangle = () => {
    let positionX = Math.random()*canvas.width;
    let positionY = Math.random()*canvas.height;
    Composite.add(engine.world, Bodies.rectangle(positionX, positionY, 200, 50));
};

