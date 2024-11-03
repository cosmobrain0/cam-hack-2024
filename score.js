let score = 100000;
let scoreIncrease = 30000;
let scoreDecay = 0;
let gameOver = false;
let getHighScore = () => {
  let result = parseInt(localStorage.getItem("highscore"));
  if (isNaN(result)) {
    setHighScore("highscore", "0");
    return 0;
  }
  return result;
}

let setHighScore = v => {
  localStorage.setItem("highscore", `${v}`);
}

let updateScore = v => {
  if (v > getHighScore()) setHighScore(v);
}

updateScore(score);

let restartGame = () => {
  location.reload(); // this is a beautiful, wonderful, great idea with no flaws whatsoever
}

setInterval(() => spawnNewAsteroid(), 5000);
