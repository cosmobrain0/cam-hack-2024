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
        let positionX = event.clientX;
        let positionY = event.clientY;
    
        if (shapeMode === "square") {
            Composite.add(engine.world, Bodies.rectangle(positionX, positionY, 50, 50));
        } else if (shapeMode === "rectangle") {
            Composite.add(engine.world, Bodies.rectangle(positionX, positionY, 200, 50));
        }
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

