function applyRotate(body, amount) {
    let angular = Body.getAngularVelocity(body);
    Body.setAngularVelocity(body, angular + amount * deltaTime / 1000);
}

function boost(body, amount) {
    Body.applyForce(body, body.position, Vector.rotate(
        Vector.create(amount, 0),
        body.angle - Math.PI/2)
    );
}

let keybinds = {
    "a": () => applyRotate(ship, -0.04*shipParts),
    "d": () => applyRotate(ship, 0.04*shipParts),
    "w": () => boost(ship, 0.0002*shipParts),
}

function smoothApply() {
    window.addEventListener('keydown', e => {
        if (keybinds[e.key]) {
            keyMap.set(e.key, keybinds[e.key]);
        }
    });
    window.addEventListener('keyup', e => {
        if (keybinds[e.key] && keyMap.has(e.key)) {
            keyMap.delete(e.key);
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
    let positionX = e.clientX + renderer.bounds.min.x;
    let positionY = e.clientY + renderer.bounds.min.y;

    let body = Matter.Query.point(
        Composite.allBodies(engine.world),
        Vector.create(positionX, positionY)
    )[0];

    if (!body) {
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

        highlightedBody.render.lineWidth = 0;
        highlightedBody = null;
    } else {
        highlightedBody = body;
        highlightedBody.render.lineWidth = 5;
        highlightedBody.render.strokeStyle = "#f00";
    }
})

