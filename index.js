// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Vector = Matter.Vector,
    Events = Matter.Events,
    Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create({
    gravity: Vector.create(0, 0)
});

let canvas;
let previousUpdateTime = performance.now();
var keyMap = new Map();
var deltaTime = 0.1;

(function run() {
    if (!canvas) {
        canvas = document.getElementsByTagName("canvas")[0];
    }

    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let currentTime = performance.now();
    deltaTime = currentTime - previousUpdateTime;
    previousUpdateTime = currentTime;
    Engine.update(engine, deltaTime);

    // boxA.angle = boxB.angle = Vector.angle(Vector.sub(boxB.position, boxA.position), Vector.create(1, 0));
    
    keyMap.values().forEach(f => f());
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
createShip();
let renderer = Render.create({
    element: document.body, 
    engine: engine,
    options: {
        wireframes: false, // Enable colour
        hasBounds: true,
        width: window.innerWidth,
        height: window.innerHeight,
    },
});

Render.run(renderer);

let shapeMode = "";

// toggle for square button
const selectSquare = () => {
    shapeMode = "square";
};

// toggle for rectangle button
const selectRectangle = () => {
    shapeMode = "rectangle";
};

