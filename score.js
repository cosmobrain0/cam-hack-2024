let score = 100000;
let scoreIncrease = 30000;
let scoreDecay = 0;
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
