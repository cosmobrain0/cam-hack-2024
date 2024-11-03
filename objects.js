function createGround() {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, 2060, 60, { isStatic: true });
    Composite.add(engine.world, [ground]);
}

let redCircle;
function createRedCircle() {
    const x = Math.random() * (window.innerWidth - 60) + 30 - window.innerWidth/2 + ship.position.x; // To keep it within bounds
    const y = Math.random() * (window.innerHeight - 60) + 30 - window.innerHeight/2 + ship.position.y; // To keep it within bounds

    // Create a circle and add it to the world
    let redCircle = Bodies.circle(x, y, 30, {
        isSensor: true,
        render: {
            fillStyle: '#f00',
        }
    });

    Composite.add(engine.world, redCircle);
    return redCircle;
}

// Function to reposition the red circle randomly
function repositionCircle() {

    // Update the position of the red circle
    if (redCircle) redCircle.isSensor = false;
    redCircle = createRedCircle();
}

function constructConstraint(a, b) {
    return Constraint.create({
        bodyA: a,
        bodyB: b,
        stiffness: 1
    });
}

let ship;

function createShip() {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let inner = 100 / Math.sqrt(3);

    let core = Bodies.rectangle(centerX, centerY + inner, 40, 40);
    let coords = [
        [centerX - 50, centerY + 50 * Math.sqrt(3)],
        [centerX, centerY],
        [centerX + 50, centerY + 50 * Math.sqrt(3)],
    ];

    console.log("hello");
    var squares = coords.map(([x, y]) => Bodies.rectangle(x, y, 20, 20));
    squares.push(core);

    // let constraints = squares.flatMap((a, i) =>
    //     squares
    //     .slice(i + 1)
    //     .map(b => constructConstraint(a, b))
    // )

    // Composite.add(engine.world, core);
    // Body.setParts(core, squares);
    // Composite.add(engine.world, squares);
    // Composite.add(engine.world, constraints);

    ship = Body.create({parts: squares});
    Composite.add(engine.world, ship);
}

window.addEventListener('load', _ => {
    console.log("hi");
    redCircle = createRedCircle();
    Events.on(engine, 'collisionStart', function (event) {
        const pairs = event.pairs;

        let collidingPair = pairs.find(pair => pair.bodyA === redCircle || pair.bodyB === redCircle);
        if (collidingPair) {
            let other = redCircle == collidingPair.bodyA ? collidingPair.bodyB : collidingPair.bodyA;
            Composite.add(engine.world, [constructConstraint(ship, redCircle)]);
            repositionCircle();
        }
    });

    console.log("starting stuff");
    Events.on(renderer, 'beforeRender', _ => {
        console.log("before render");
        let centre = ship.position; 
        let extents = Vector.create(window.innerWidth/2, window.innerHeight/2);
        renderer.bounds.max = Vector.add(centre, extents);
        renderer.bounds.min = Vector.sub(centre, extents);
        renderer.canvas.width = window.innerWidth;
        renderer.canvas.height = window.innerHeight;
        // Matter.Bounds.translate(renderer.bounds, Vector.create(100, 0));
    });
})
