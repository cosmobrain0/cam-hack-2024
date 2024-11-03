function applyRotate(body, amount) {
    // let angular = Body.getAngularVelocity(body);
    Body.setAngularVelocity(body, amount);
}

function boost(body, amount) {
    Body.setVelocity(body, Vector.rotate(
        Vector.create(amount, 0),
        body.angle + 2 * Math.PI / 3)
    );
}

window.addEventListener('keydown', e => {
    if (e.key == "a") applyRotate(ship, -0.1);
    if (e.key == "d") applyRotate(ship, 0.1);
    if (e.key == "w") boost(ship, 10);
});

/**
    @param {Matter.Body} box
    @param {Matter.Vector} localVelocity
*/
const accelerate = (box, localVelocity) => {
    let acceleration = Vector.rotate(localVelocity, box.angle);
    box.force.x += acceleration.x;
    box.force.y += acceleration.y;
}

window.addEventListener('click', e => {
    if (!(e.target instanceof HTMLCanvasElement)) return;
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

