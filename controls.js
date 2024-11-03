function applyRotate(body, amount) {
    let angular = Body.getAngularVelocity(body);
    Body.setAngularVelocity(body, angular + amount * deltaTime / 1000);
}

function boost(body, amount) {
    Body.applyForce(body, body.position, Vector.rotate(
        Vector.create(amount, 0),
        body.angle + 2 * Math.PI / 3)
    );
}

let keybinds = {
    "a": () => applyRotate(ship, -0.1),
    "d": () => applyRotate(ship, 0.1),
    "w": () => boost(ship, 0.005),
}

function smoothApply() {
    window.addEventListener('keydown', e => {
        if (keybinds[e.key]) {
            runQueue.set(e.key, keybinds[e.key]);
        }
    });
    window.addEventListener('keyup', e => {
        if (keybinds[e.key] && runQueue.has(e.key)) {
            runQueue.delete(e.key);
        }
    });
}

smoothApply();

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

