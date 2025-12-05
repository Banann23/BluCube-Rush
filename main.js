var hero = document.getElementById("heroImage");
var enemyGround = document.getElementById("groundEnemyImage");
var enemyFlying = document.getElementById("flyingEnemyImage");

var backgroundMusic = document.getElementById("bg-music");
var jumpSound = document.getElementById("jump-sound");
var cheerSound = document.getElementById("500-sound");
var biggerCheerSound = document.getElementById("1000-sound");
var criticalSound = document.getElementById("critical-sound");

var scoreBlock = document.getElementById("Score");
var gameOverBlock = document.getElementById("gameOver");
var inputBlock = document.getElementById("html");
var start = document.getElementById("startButton");

var scoreCounter = document.getElementById("scoreCounter");
var bestScoreCounter = document.getElementById("bestScoreCounter");
var scoreSoundTrigger = 0;
var score = 0;
var bestScore = 0;

var scoreIntervalId = null;  // Separate interval for score counting
var animationIntervalId = null;  // Separate interval for enemy animation
var isDead = null;  // Store if the character is dead

var whichEnemy = null;  // Randomly choose 1 or 2 for ground or flying enemy
var timeBetweenAttack = Math.random() + 1;
var animationTime = Math.random() + 1;

var isStarted = null;

enemyGround.style.display = "none";
enemyFlying.style.display = "none";
hero.src = "assets/hero.png";

// Function to start the game when "W" is pressed
function startGame(event) {
    let key = event.key;

    if (key == 'w' && isDead == 1) {
        // If game is over, reset everything
        isDead = 0;
        resetGame();
    }

    if (key == "w" && scoreIntervalId === null) {  // Check if the score interval isn't already running
        // Start the score counter
        startCounter();

        // Start the game
        document.body.style.filter = "grayscale(0%)";
        isStarted = 1;

        // Start randomizing and animating the enemies
        startAnimation();

        hero.src = "assets/heroMove.gif";
        start.style.visibility = "hidden";
        score = 0;
        scoreCounter.innerHTML = score;  // Reset score display immediately

        // Start the music playing
        backgroundMusic.play();
    }
}

// Function to randomize and start enemy animation
function startAnimation() {
    // Clear any previous intervals to avoid multiple intervals running at the same time
    clearInterval(animationIntervalId);

    animationIntervalId = setInterval(function () {
        // Randomly select between 1 (ground enemy) and 2 (flying enemy)
        whichEnemy = Math.round(Math.random()) + 1; // Random number between 1 and 2

        // Reset both enemies' animations before starting a new one
        enemyGround.classList.remove("animateMoveEnemy");
        enemyFlying.classList.remove("animateMoveEnemy");
        enemyGround.style.display = "none";
        enemyFlying.style.display = "none";

        if (isDead != 1) {
            if (whichEnemy === 1) {
                enemyGround.style.display = "initial";
                enemyGround.classList.add("animateMoveEnemy");
                enemyGround.src = "assets/enemyMove.gif";  // Set the ground enemy animation
                console.log("Ground enemy selected.");
            } else if (whichEnemy === 2) {
                enemyFlying.style.display = "initial";
                enemyFlying.classList.add("animateMoveEnemy");
                enemyFlying.src = "assets/enemyFlyingMove.gif";  // Set the ground enemy animation
                console.log("Ground enemy selected.");
            }
        } else hero.src = "assets/heroDead.png";
    }, 1400);  // Change enemy every 1100ms
}


// Function to reset the game (for restart)
function resetGame() {
    // Reset hero and enemy images, animations, positions
    hero.src = "assets/hero.png";
    enemyGround.src = "assets/enemy.png";
    enemyFlying.src = "assets/enemyFlyingMove1.png";
    hero.classList.remove("animateHeroJump");
    hero.classList.remove("animateHeroCrouch");
    enemyGround.classList.remove("animateMoveEnemy");
    enemyFlying.classList.remove("animateMoveEnemy");

    // Reset the score and ensure scoreCounter is updated correctly
    score = 0;
    scoreSoundTrigger = 0;
    scoreCounter.innerHTML = score;  // Reset the score immediately
    scoreIntervalId = null;  // Clear the score interval if it exists

    // Hide the "GAME OVER" text and the "Press W to try again" button
    gameOverBlock.style.display = "none";
    scoreBlock.style.display = "block";  // Show the score block again
    scoreCounter = document.getElementById("scoreCounter");
    start.style.visibility = "hidden";  // Hide the "Try again" button
    document.body.style.filter = "grayscale(0%)"; // Remove grayscale effect after reset

    // Ensure both enemies are visible after reset
    enemyGround.style.visibility = "visible";
    enemyFlying.style.visibility = "visible";

    // Start the score counter
    startCounter();

}

// Function to start counting the score
function startCounter() {
    // Clear any existing interval to prevent multiple intervals from running
    if (scoreIntervalId !== null) {
        clearInterval(scoreIntervalId);  // Clear the old interval
    }

    scoreIntervalId = setInterval(function () {
        scoreSoundTrigger++;  // Increment score sound trigger
        scoreCounter.innerHTML = score++;  // Update the score on screen

        // Play cheer sound every 500 points
        if (scoreSoundTrigger == 500) {
            cheerSound.play();
        }

        if (scoreSoundTrigger == 1000) {
            biggerCheerSound.play();
            scoreSoundTrigger = 0;
        }
    }, 10);  // Increment score every 10 ms
}

// Function to handle hero actions (jump or crouch)
function heroAction(event) {
    let key = event.key;

    if (hero.classList != "animateHeroJump" && hero.classList != "animateHeroCrouch") {
        if (key == "w") {
            hero.classList.add("animateHeroJump");
            jumpSound.play();
            hero.src = "assets/hero.png";
            setTimeout(function () {
                hero.src = "assets/heroMove.gif";
                hero.classList.remove("animateHeroJump");
            }, 500);
        } else if (key == "s") {
            hero.classList.add("animateHeroCrouch");
            setTimeout(function () {
                hero.classList.remove("animateHeroCrouch");
            }, 500);
        }
    }
}

// Function to check for collisions and handle game over
var checkDead = setInterval(function () {
    var characterBottom = parseInt(window.getComputedStyle(hero).getPropertyValue("bottom"));
    var heroTop = characterBottom + hero.offsetHeight;
    var enemyGroundLeft = parseInt(window.getComputedStyle(enemyGround).getPropertyValue("left"));
    var enemyFlyingLeft = parseInt(window.getComputedStyle(enemyFlying).getPropertyValue("left"));

    if (enemyGroundLeft > 160 && enemyGroundLeft < 288 && characterBottom <= 241.6 || enemyFlyingLeft > 160 && enemyFlyingLeft < 288 && heroTop >= 208) {
        document.body.style.filter = "grayscale(100%)"; // Turn screen black and white
        scoreBlock.style.display = "none";
        gameOverBlock.style.display = "block";  // Show "GAME OVER" text
        start.innerText = "Press W to try again";  // Change text to indicate to press "W" to restart
        start.style.visibility = "visible";
        criticalSound.play();

        enemyGround.classList.remove("animateMoveEnemy");
        enemyFlying.classList.remove("animateMoveEnemy");

        enemyGround.style.display = "none";
        enemyFlying.style.display = "none";

        hero.src = "assets/heroDead.png";

        clearInterval(scoreIntervalId); // Stop score counting on game over

        whichEnemy = 0;
        isDead = 1;

        bestScore = Math.max(bestScore, score); // Save the best score
        bestScoreCounter.innerHTML = bestScore; // Display best score

        score = 0; // Reset the current score
        scoreCounter.innerHTML = score; // Reset the score on the screen
        scoreIntervalId = null;  // Ensure the interval is cleared
    }
}, 10);

// Listen for keypress events
document.addEventListener("keypress", function (event) {
    heroAction(event);
    startGame(event);
});
