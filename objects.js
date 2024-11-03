function createGround() {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, 2060, 60, { isStatic: true });
    Composite.add(engine.world, [ground]);
}

let redCircle;
function createRedCircle() {
    const x = Math.random() * (window.innerWidth - 60) + 30 - window.innerWidth/2 + ship.position.x; // To keep it within bounds
    const y = Math.random() * (window.innerHeight - 60) + 30 - window.innerHeight/2 + ship.position.y; // To keep it within bounds

    // Create a circle and add it to the world
    let redCircle = Bodies.circle(x, y, 10, {
        isStatic: false,
        density: 0.01,
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
    if (redCircle) redCircle.isStatic = false;
    redCircle = createRedCircle();
}

function constructAsteroid() {
    let angle = Math.random() * 2 * Math.PI;
    let radius = Math.max(-Math.log2(Math.random()) * 5000, 200);
    let asteroid = Bodies.rectangle(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        40,
        40,
        {
            render: {fillStyle: "#fff"},
            frictionAir: 0,
            label: "Asteroid",
        }
    );

    Body.setAngularSpeed(asteroid, Math.random() / 10);
    Body.setVelocity(
        asteroid,
        Vector.rotate(Vector.create(Math.random(), 0), Math.random() * 2 * Math.PI)
    );

    return asteroid;
}


let asteroids;
function createAsteroids() {
    asteroids = Array.from({length: 50}, constructAsteroid);
    Composite.add(engine.world, asteroids);
}


function constructConstraint(a, b, stiffness = 0.0001) {
    return Constraint.create({
        bodyA: a,
        bodyB: b,
        length: Vector.magnitude(Vector.sub(a.position, b.position))*1.05,
        stiffness: stiffness,
    });
}

/** @type {Matter.Body} */
let ship;
let shipPartsCount;
let shipParts = [];
function createShip() {
    shipPartsCount = 5;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let inner = 100 / Math.sqrt(3);

    let core = Bodies.rectangle(centerX, centerY + inner, 40, 40);
    let coords = [
        [centerX - 50, centerY + 50 * Math.sqrt(3), "Left"],
        [centerX, centerY, "Centre"],
        [centerX + 50, centerY + 50 * Math.sqrt(3), "Right"],
    ];

    var squares = coords.map(([x, y, label]) => Bodies.rectangle(x, y, 20, 20, {label: label}));
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
    redCircle = createRedCircle();
    createAsteroids();
    Events.on(engine, 'collisionStart', function (event) {
        for (let pair of event.pairs) {
            if (asteroids.includes(pair.bodyA) || asteroids.includes(pair.bodyB)) {
                if (shipParts.includes(pair.bodyA) || shipParts.includes(pair.bodyB)) {
                    // delete both parts and constraints
                    for (let constraint of Matter.Composite.allConstraints(engine.world).filter(x => x.bodyB == pair.bodyA || x.bodyB == pair.bodyB)) {
                       Matter.Composite.remove(engine.world, constraint, true); 
                    }
                    Matter.Composite.remove(engine.world, pair.bodyA);
                    Matter.Composite.remove(engine.world, pair.bodyB);
                }
            }
        }
    });
    Events.on(engine, 'collisionStart', function (event) {
        const pairs = event.pairs;

        let collidingPair = pairs.find(pair => 
            (pair.bodyA === redCircle || pair.bodyB === redCircle)
            && pair.bodyA.label != "Asteroid"
            && pair.bodyB.label != "Asteroid"
        );
        if (collidingPair) {
            let other = redCircle == collidingPair.bodyA ? collidingPair.bodyB : collidingPair.bodyA;
            if (ship.parts.includes(other)) other = ship;
            shipPartsCount++;
            shipParts.push(redCircle);
            score += scoreIncrease;
            scoreDecay = 0
            Composite.add(engine.world, [constructConstraint(other, redCircle)]);
            repositionCircle();
        }

        let asteroidPair = pairs.find(pair =>
            (pair.bodyA.label == "Asteroid" || pair.bodyB.label == "Asteroid")
            && (pair.bodyA.parent === ship || pair.bodyB.parent === ship)
        );

        if (asteroidPair) {
            Matter.Composite.remove(engine.world, ship);
            alert("GAME OVER. Your best score was ".concat(Math.round((getHighScore()/100)).toString()).concat("!"));
        }
    });

    Events.on(renderer, 'beforeRender', _ => {
        // change the `10` to `0` to make the camera follow properly
        let centre = Vector.sub(ship.position, Vector.mult(ship.velocity, 0)); 
        let extents = Vector.create(window.innerWidth/2, window.innerHeight/2);
        renderer.bounds.max = Vector.add(centre, extents);
        renderer.bounds.min = Vector.sub(centre, extents);
        renderer.canvas.width = window.innerWidth;
        renderer.canvas.height = window.innerHeight;
        // Bounds.translate(renderer.bounds, Vector.create(100, 0));
        let ctx = renderer.context;
        ctx.font = "bold 48px 'Bebas Neue'";

    });
    Events.on(renderer, 'afterRender', _ => {
        const distanceThreshold = 150;

        let offset = Vector.sub(redCircle.position, ship.position);
        let originalDistance = Vector.magnitude(offset);
        let distance = Math.min(distanceThreshold, originalDistance);
        offset = Vector.mult(Vector.normalise(offset), distance);
        let ctx = renderer.context;
        let centre = Vector.create(renderer.canvas.width/2, renderer.canvas.height/2);

        if (originalDistance >= distanceThreshold) {
            let offsetAngle = Vector.angle(offset, Vector.create(1, 0));
            ctx.beginPath();
            ctx.arc(centre.x+offset.x, centre.y+offset.y, 10.0, offsetAngle-5*Math.PI/4, offsetAngle-3*Math.PI/4);
            ctx.lineTo(centre.x+offset.x, centre.y+offset.y);
            ctx.globalAlpha = Math.max(0, (originalDistance/400) - 0.25) 
            ctx.fillStyle = "#f00";
            ctx.fill();
            ctx.globalAlpha = 1
        }

        ctx.fillStyle = "#fff";
        ctx.font = "45px monospace";
        ctx.fillText(`Score: ${Math.round(score/100)}`, 55, 60);
        ctx.fillStyle = "#aaa";
        ctx.font = "25px monospace";
        updateScore(score);
        ctx.fillText(`Best: ${Math.round(getHighScore()/100)}`, 55, 95);
    })
})
