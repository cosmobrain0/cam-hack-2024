function createGround() {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, 2060, 60, { isStatic: true });
    Composite.add(engine.world, [ground]);
}

createGround();

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

createRedCircle();
