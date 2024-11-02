function applyRotate(body, amount) {
    let angular = Matter.Body.getAngularVelocity;
    Matter.Body.setAngularVelocity(body, angular + amount);
}

window.addEventListener('keydown', e => {
    if (e.key == "a") accelarate(boxA, Vector.create(0, -0.2));
    if (e.key == "d") accelarate(boxB, Vector.create(0, -0.2));
});

/**
    @param {Matter.Body} box
    @param {Matter.Vector} localVelocity
*/
const accelarate = (box, localVelocity) => {
    let acceleration = Vector.rotate(localVelocity, box.angle);
    box.force.x += acceleration.x;
    box.force.y += acceleration.y;
}

canvas.addEventListener('click', e => {
    let body = Matter.Query.point(Composite.allBodies(engine.world), Vector.create(e.clientX, e.clientY))[0];
    if (!body) {
        let positionX = e.clientX;
        let positionY = e.clientY;
    
        switch(shapeMode) {
            case "square":
                Composite.add(engine.world, Bodies.rectangle(positionX, positionY, 50, 50));
                break;
            case "rectangle":
                Composite.add(engine.world, Bodies.rectangle(positionX, positionY, 200, 50));
                break;
        }

        highlightedBody = null;

    } else if (highlightedBody) {
        Composite.add(engine.world, [Constraint.create({
            bodyA: body,
            bodyB: highlightedBody,
            length: 100,
            stiffness: 1,
        })])
        highlightedBody = null;
    } else {
        highlightedBody = body;
    }
})

