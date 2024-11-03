let canvas;
let previousUpdateTime = performance.now();
var keyMap = new Map();
var deltaTime = 0.1;

(function run() {
    if (!canvas) {
        canvas = document.getElementsByTagName("canvas")[0];
    }

    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let currentTime = performance.now();
    deltaTime = currentTime - previousUpdateTime;
    if (!gameOver) {
        scoreDecay += deltaTime / (500); // 100 * shipParts? it returned NaN
        scoreDecay = Math.min(30, scoreDecay);
        score -= scoreDecay / 5;
        score = Math.max(score, 0);
    }
    previousUpdateTime = currentTime;
    Engine.update(engine, deltaTime);

    // boxA.angle = boxB.angle = Vector.angle(Vector.sub(boxB.position, boxA.position), Vector.create(1, 0));
    
    keyMap.values().forEach(f => f());
    window.requestAnimationFrame(run);
})();

createShip();
let renderer = Render.create({
    element: document.body, 
    engine: engine,
    options: {
        wireframes: false, // Enable colour
        hasBounds: true,
        width: window.innerWidth,
        height: window.innerHeight,
    },
});

Render.run(renderer);

let shapeMode = "";

// toggle for square button
const selectSquare = () => {
    shapeMode = "square";
};

// toggle for rectangle button
const selectRectangle = () => {
    shapeMode = "rectangle";
};

bgMusic = new Audio("./sounds/rhythm_gardenmix6_0.ogg");
bgMusic.loop = true;
bgMusic.volume = 0.5;
var isPlayingBgMusic = false;

