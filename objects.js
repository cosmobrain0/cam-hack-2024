function createGround() {
    var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, 2060, 60, { isStatic: true });
    Composite.add(engine.world, [ground]);
}

let redCircle;
function createRedCircle() {

    // the circles can spawn quite far from the player
    // and the circles can't spawn too close
    let x, y;
    let distance = () => Vector.magnitude(Vector.sub(Vector.create(x, y), ship.position));
    do {
        x = Math.random() * (window.innerWidth*2 - 60) + 30 - window.innerWidth + ship.position.x; // To keep it within bounds
        y = Math.random() * (window.innerHeight*2 - 60) + 30 - window.innerHeight + ship.position.y; // To keep it within bounds
    } while (distance() <= 60);

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

function spawnNewAsteroid(oldToDelete) {
    let index;
    if (oldToDelete) {
        index = asteroids.indexOf(oldToDelete);
        Matter.Composite.remove(engine.world, oldToDelete);
    } else {
        let distance = x => Vector.magnitude(Vector.sub(x.position, ship.position));
        index = 0;
        let bestDistance = distance(asteroids[0]);
        for (let i=1; i<asteroids.length; i++) {
            let currentDistance = distance(asteroids[i]);
            if (currentDistance <= bestDistance) {
                index = i;
                bestDistance = currentDistance;
            }
        }
        Matter.Composite.remove(engine.world, oldToDelete);
    }
    asteroids[index] = constructAsteroid();
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
    let asteroid = Matter.Bodies.rectangle(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        40,
        40,
        {
            render: { sprite: {
                texture: 'img/asteroid.png',
                xScale: 45/512,
                yScale: 45/512,
            } },
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
        if (gameOver) return;
        for (let pair of event.pairs) {
            if (asteroids.includes(pair.bodyA) || asteroids.includes(pair.bodyB)) {
                if (shipParts.includes(pair.bodyA) || shipParts.includes(pair.bodyB)) {
                    // delete both parts and constraints
                    for (let constraint of Matter.Composite.allConstraints(engine.world).filter(x => x.bodyB == pair.bodyA || x.bodyB == pair.bodyB)) {
                       Matter.Composite.remove(engine.world, constraint, true); 
                    }
                    Matter.Composite.remove(engine.world, pair.bodyA);
                    Matter.Composite.remove(engine.world, pair.bodyB);
                    scoreDecay += 20;
                    score -= 5000;
                    applyRotate(ship, Math.random()*20 - 10);
                }
            }
        }
    });
    Events.on(engine, 'collisionStart', function (event) {
        if (gameOver) return;
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

            let sound = new Audio("./sounds/item_pickup.wav");
            sound.play();
        }

        let asteroidPair = pairs.find(pair =>
            (pair.bodyA.label == "Asteroid" || pair.bodyB.label == "Asteroid")
            && (pair.bodyA.parent === ship || pair.bodyB.parent === ship)
        );

        if (asteroidPair) {
            let sound = new Audio("./sounds/sfx_-_death_explosion.ogg");
            sound.play();
            applyRotate(ship, 135); 
            gameOver = true;
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

        /** @type {CanvasRenderingContext2D} */
        let ctx = renderer.context;
        if (gameOver) {
            ctx.fillStyle = "#0007";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        let offset = Vector.sub(redCircle.position, ship.position);
        let originalDistance = Vector.magnitude(offset);
        let distance = Math.min(distanceThreshold, originalDistance);
        offset = Vector.mult(Vector.normalise(offset), distance);
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
        if (gameOver) {
            let textBounds = ctx.measureText("Press R to restart!");
            let textWidth = textBounds.actualBoundingBoxRight-textBounds.actualBoundingBoxLeft;
            ctx.fillText(`Press R to restart!`, window.innerWidth/2-textWidth/2, 60);
        }
        ctx.fillStyle = "#aaa";
        ctx.font = "25px monospace";
        if (!gameOver) updateScore(score);
        ctx.fillText(`Best: ${Math.round(getHighScore()/100)}`, 55, 95);
    })
})
