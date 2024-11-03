function createGround() {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, 2060, 60, { isStatic: true });
    Composite.add(engine.world, [ground]);
}

let redCircle;
function createRedCircle() {
    const x = Math.random() * (window.innerWidth - 60) + 30; // To keep it within bounds
    const y = Math.random() * (window.innerHeight - 60) + 30; // To keep it within bounds

    // Create a circle and add it to the world
    redCircle = Bodies.circle(x, y, 30, {
        isStatic: true, // Prevents it from being affected by gravity
        render: {
            strokeStyle: '#f00', // Set stroke (outline) color to red
        }
    });

    Composite.add(engine.world, redCircle);
}

// Function to reposition the red circle randomly
function repositionCircle() {
    const x = Math.random() * (window.innerWidth - 60) + 30; // To keep it within bounds
    const y = Math.random() * (window.innerHeight - 60) + 30; // To keep it within bounds

    // Update the position of the red circle
    Body.setPosition(redCircle, { x: x, y: y });
}

Events.on(engine, 'collisionStart', function (event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        if (pair.bodyA === redCircle || pair.bodyB === redCircle) {
            // If red circle collides with any body, reposition it
            repositionCircle();
        }
    });
});

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

    let core = Bodies.rectangle(centerX, centerY + inner, 20, 20);
    Composite.add(engine.world, core);

    let coords = [
        [centerX, centerY],
        [centerX - 50, centerY + 50 * Math.sqrt(3)],
        [centerX + 50, centerY + 50 * Math.sqrt(3)],
    ];

    let squares = coords.map(([x, y]) => Bodies.rectangle(x, y, 20, 20));
    Body.setParts(core, squares);

    // let constraints = squares.flatMap((a, i) =>
    //     squares
    //     .slice(i + 1)
    //     .map(b => constructConstraint(a, b))
    // )
    // Composite.add(engine.world, constraints);

    ship = core;
}

createGround();
createShip();
createRedCircle();