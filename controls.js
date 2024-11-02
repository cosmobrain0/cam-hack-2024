function applyRotate(body, amount) {
    let angular = Matter.Body.getAngularVelocity;
    Matter.Body.setAngularVelocity(body, angular + amount);
}

window.addEventListener('keydown', e => {
    if (e.key == "a") boxA.force.y -= 0.2
    if (e.key == "d") boxB.force.y -= 0.2
});

canvas.addEventListener('click', e => {
    let body = Matter.Query.point(Composite.allBodies(engine.world), Vector.create(e.clientX, e.clientY))[0];
    if (!body) {
        // Calculate position based on mouse click
        const x = e.clientX;
        const y = e.clientY;

        // Create two new boxes at the click location, slightly offset from each other
        const boxC = Bodies.rectangle(x - 40, y, 80, 80);
        const boxD = Bodies.rectangle(x + 40, y, 80, 80);

        // Create a rod (constraint) between the new boxes
        const rod = Constraint.create({
            length: 80,
            stiffness: 0.9,
            bodyA: boxC,
            bodyB: boxD
        });

        // Add the new boxes and the rod to the world
        Composite.add(engine.world, [boxC, boxD, rod]);
        highlightedBody = null;
    } else if (highlightedBody) {
        Composite.add(engine.world, [Constraint.create({
            bodyA: body,
            bodyB: highlightedBody,
            length: 100,
            stiffness: 0.01,
        })])
        highlightedBody = null;
    } else {
        highlightedBody = body;
    }
})

