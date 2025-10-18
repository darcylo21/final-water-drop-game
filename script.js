// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerDuration = 30; // Game duration in seconds
const timerDisplay = document.getElementById("time"); // Reference to the timer display element
const scoreDisplay = document.getElementById("score"); // Reference to the score display element
let score = 0; // Player's score
let countdown; // Timer ID

//sound effects
const popSound = new Audio("sounds/collect-points-190037.mp3");
const badDropSound = new Audio("sounds/falled-sound-effect-278635.mp3");

//game mode settings
let mode = "medium"; //default mode is medium
let dropSpeed = 4; //default drop speed for medium mode
let dropInterval = 1000; //default drop interval for medium mode
let gameDuration = 30; //default game duration for medium mode
let percentBadDrops = 0.2; //20% of drops are bad drops


document.getElementById("start-btn").addEventListener("click", startGame);

//difficulty select event listener
document.getElementById("difficulty-select").addEventListener("change", function(event){
  mode = event.target.value; //update mode based on user selection
});

// Function to start the game

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  setMode(); // Set game parameters based on selected mode

  //reset timer for next game 
  timerDuration = gameDuration;
  timerDisplay.textContent = timerDuration;

  // Reset score and update display
  score = 0;
  scoreDisplay.textContent = score;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, dropInterval);

  // Reset and display the timer
  startTimer();

}

// mode functions 
function setMode(){
  if (mode === "easy"){
    dropSpeed = 6;
    dropInterval = 1500;
    gameDuration = 60;
    percentBadDrops = 0.1; // 10% bad drops for easy mode
  }else if (mode === "medium"){
    dropSpeed = 4;
    dropInterval = 1000;
    gameDuration = 30;
    percentBadDrops = 0.2; // 20% bad drops for medium mode
  }else if (mode === "hard"){
    dropSpeed = 2;
    dropInterval = 700;
    gameDuration = 20;
    percentBadDrops = 0.3; // 30% bad drops for hard mode
  }
}

function endGame() {
  clearInterval(countdown); // Stop the countdown timer
  clearInterval(dropMaker); // Stop creating new drops
  const drops = document.querySelectorAll(".water-drop,.bad-drop");
  drops.forEach(drop => drop.remove()); // Remove all existing drops
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
      setTimeout(() => {
        alert("Time's up! Please try again T^T");
      }, 300); 
    }
  }, 1000);
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  //creating a varaible to check if a drop is bad or not

  const isBadDrop = Math.random() < percentBadDrops; // 20% chance of being a bad drop

  // Assign the appropriate class based on drop type
  if (!isBadDrop){
    drop.className = "water-drop";
  } else {
    drop.className = "bad-drop";
  }

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
  drop.style.animationDuration = dropSpeed +"s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  //give user points for clicking the drop
  drop.addEventListener("click", () => {
    if (isBadDrop && score > 0){
      badDropSound.play(); //play bad drop sound effect
      score --; //decrease score by 1 for bad drop
    } else if (!isBadDrop){
      popSound.play(); //play pop sound effect
      score++; //increase score by 1
    }

    scoreDisplay.textContent = score; //update score display
    drop.remove(); //remove the drop once clicked

    //check if the user has won
    if (score === 20){
      confetti(); //call the confetti function to celebrate
      endGame(); //end the game
      setTimeout(() => {
        alert("Congratulations :3 You've reached 20 points and won the game >v<");
      }, 300); 
    }
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}
