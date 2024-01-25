const gridSize = 20;
const snake = [{ x: 5, y: 5 }];
let direction = "right";
let nextDirection = "right";
let food = generateFood();
let score = 0;
let gameRunning = false;

// Load user name from localStorage
let userName = localStorage.getItem("snakeGameUserName");

// Prompt for user name if not available in localStorage or if the name is empty
while (!userName || userName.trim() === "") {
  userName = prompt("Please enter your name:");
  localStorage.setItem("snakeGameUserName", userName);
}

// Display personalized greeting
document.getElementById(
  "greeting"
).innerHTML = `Hello ${userName}!<br>Welcome to the Snake Game.<br><br><br>_made by Maruf OVi.`;

// Load score history from localStorage on page load
let scoreHistory =
  JSON.parse(localStorage.getItem("snakeGameScoreHistory")) || [];

function generateFood() {
  const x = Math.floor(Math.random() * gridSize);
  const y = Math.floor(Math.random() * gridSize);
  return { x, y };
}

function draw() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  const scoreElement = document.createElement("div");
  scoreElement.innerText = `Score: ${score}`;
  gameBoard.appendChild(scoreElement);

  snake.forEach((segment) => {
    const snakePart = document.createElement("div");
    snakePart.className = "snake-part";
    snakePart.style.left = `${segment.x * 20}px`;
    snakePart.style.top = `${segment.y * 20}px`;
    gameBoard.appendChild(snakePart);
  });

  const foodElement = document.createElement("div");
  foodElement.className = "food";
  foodElement.style.left = `${food.x * 20}px`;
  foodElement.style.top = `${food.y * 20}px`;

  const foodImage = document.createElement("img");
  foodImage.src = "apple.webp"; 
  foodElement.appendChild(foodImage);

  gameBoard.appendChild(foodElement);

  drawScoreHistory();
}

function update() {
  if (!gameRunning) {
    return;
  }

  const head = Object.assign({}, snake[0]);

  direction = nextDirection;

  switch (direction) {
    case "up":
      head.y = (head.y - 1 + gridSize) % gridSize;
      break;
    case "down":
      head.y = (head.y + 1) % gridSize;
      break;
    case "left":
      head.x = (head.x - 1 + gridSize) % gridSize;
      break;
    case "right":
      head.x = (head.x + 1) % gridSize;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score++;
  } else {
    snake.pop();
  }

  const collision = snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
  if (collision) {
    alert(`Game Over! Your Score: ${score}. Refresh to play again.`);
    snake.length = 1;
    direction = "right";
    nextDirection = "right";
    scoreHistory.push(score);
    localStorage.setItem("snakeGameScoreHistory", JSON.stringify(scoreHistory));
    score = 0;
    gameRunning = false;
  }
}

function handleDirectionClick(clickedDirection) {
  if (!gameRunning) {
    startGame();
  }

  switch (clickedDirection) {
    case "up":
      if (direction !== "down") {
        nextDirection = "up";
      }
      break;
    case "down":
      if (direction !== "up") {
        nextDirection = "down";
      }
      break;
    case "left":
      if (direction !== "right") {
        nextDirection = "left";
      }
      break;
    case "right":
      if (direction !== "left") {
        nextDirection = "right";
      }
      break;
  }
}

function startGame() {
  gameRunning = true;
}

function drawScoreHistory() {
  const scoreHistoryElement = document.getElementById("score-history");
  scoreHistoryElement.innerHTML = "<h4>Score History</h4>";

  for (let i = 0; i < scoreHistory.length; i++) {
    const scoreItem = document.createElement("div");
    scoreItem.innerText = `Game ${i + 1}: ${scoreHistory[i]}`;
    scoreHistoryElement.appendChild(scoreItem);
  }
}

function gameLoop() {
  update();
  draw();
}

document.addEventListener("keydown", (event) =>
  handleDirectionClick(getDirectionFromKey(event.key))
);
document
  .getElementById("upButton")
  .addEventListener("click", () => handleDirectionClick("up"));
document
  .getElementById("leftButton")
  .addEventListener("click", () => handleDirectionClick("left"));
document
  .getElementById("downButton")
  .addEventListener("click", () => handleDirectionClick("down"));
document
  .getElementById("rightButton")
  .addEventListener("click", () => handleDirectionClick("right"));
document.addEventListener("click", startGame);

function getDirectionFromKey(key) {
  switch (key) {
    case "ArrowUp":
      return "up";
    case "ArrowDown":
      return "down";
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
    default:
      return "";
  }
}

setInterval(gameLoop, 100);
