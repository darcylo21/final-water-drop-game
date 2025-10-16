// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerDuration = 30; // Game duration in seconds
const timerDisplay = document.getElementById("time"); // Reference to the timer display element
const scoreDisplay = document.getElementById("score"); // Reference to the score display element
let score = 0; // Player's score
let countdown; // Timer ID


// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  //reset timer for next game 
  timerDuration = 30; 
  timerDisplay.textContent = timerDuration;

  // Reset score and update display
  score = 0;
  scoreDisplay.textContent = score;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Reset and display the timer
  startTimer();

}

function endGame() {
  clearInterval(countdown); // Stop the countdown timer
  clearInterval(dropMaker); // Stop creating new drops
  gameRunning = false;

}

function startTimer(){
  //set interval is a function already defined in JS that runs a function repeatedly at specified intervals the first paremeter is the function to run and the second parameter is how often it should run
    countdown = setInterval(function (){//this is an anonymous function and is being defined within the setInterval method
    // decrease timer by 1
    timerDuration--;

    //update the timer display
    timerDisplay.textContent = timerDuration;

    //check if timer has reached 0
    if (timerDuration <= 0){
      clearInterval(countdown); //setInterval returns an ID that can be cleared by using the clearInterval (which is another built in JS function)
      endGame();
    }
  }, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Make drops different sizes for visual variety
  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  //give user points for clicking the drop
  drop.addEventListener("click", () => {
    score++; //increase score by 1
    scoreDisplay.textContent = score; //update score display
    drop.remove(); //remove the drop once clicked

    //check if the user has won
    if (score === 20){
      confetti(); //call the confetti function to celebrate
      endGame(); //end the game
    }
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
