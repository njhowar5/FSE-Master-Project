var mode = 0;
let buttons = [];


let cols, rows;
let w = 20; //Width and height of each cell
let grid = [];
let stack = [];
let player;
let endpoint;
let playerReachedEndpoint = false;
let mazeGenerated = false;
let regenerationOverlay = 150; //Transparency level for the regeneration overlay
let winTextDisplayed = false;
let startTime;

//Moving ball vars
let ballGame = {
  ball: {
    size: 50,
    x: 0,
    y: 0,
    speed: 0,
  },
  isGreen: false,
  points: 0,
  strikes: 0,
  gameOverFlag: false,
};

//Progress vars
let progress = {
  streak: 0,
  typing: 0,
  sorting: 0,
  movingBall: 0
};

//Typing practice vars
let typing = {
    word: '',
    previousWord: '',
    userInput: '',
    chatBoxColor: 255,
    startTime: null,
    charactersTyped: 0,
    wpm: 0
};

//Sorting vars
let shapes = [],
  outlines = [],
  dragging = false,
  draggedShape = null,
  gameActive = true,
  correctMatches = 0,
  roundStartTime,
  elapsedTime;

//Sound vars
const positiveSound = new Audio('positive.mp3');
const negativeSound = new Audio('negative.mp3');
let song;

function preload() {
  positiveSound.load();
  negativeSound.load();
  //song.load();
  song = loadSound('background.mp3');
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  //Initialize buttons
  buttons.push(new TriangleButton([150, 190, 200, 90, 250, 190], screen2Setup));
  buttons.push(new TriangleButton([90, 300, 140, 200, 190, 300], screen3Setup));
  buttons.push(new TriangleButton([150, 200, 200, 300, 250, 200], screen4Setup));
  buttons.push(new TriangleButton([210, 300, 260, 200, 310, 300], screen5Setup));
  song.loop();
}

//Switches between screens
function draw() {
  background(220);
  if (mode == 0) {
    screen1();
  } else if (mode == 1) {
    screen2();
  } else if (mode == 2) {
    screen3();
  } else if (mode == 3) {
    screen4();         
  } else if (mode == 4) {
    screen5();         
  }
}

//Typing Setup
function screen2Setup() {
  textSize(32);
  pickRandomWord();
  typing.wpm = 0;
}
//Sorting Setup
function screen3Setup() {
  startRound();
}
//Progress Setup
function screen4Setup() {
  cols = floor(width / w);
  rows = floor(height / w) - 2; //Remove top two rows

  //Create a 2D array for the maze grid
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  resetMaze();
  endpoint = createVector(cols - 1, rows - 1);
  startTime = millis();
  roundStartTime = millis();
}

//Moving Ball Setup
function screen5Setup() {
  resetBallGame();
  ballGame.lastClickTime = millis();
}

//Home screen
function screen1() {
  background('#3AAFA9');
  textSize(35);
  text('Dexterity Care', 200, 50);
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].checkHover();
    buttons[i].display();
  }
  fill('#EDF5E1');
  textSize(16);
  text('Typing', 200, 160);
  text('Sorting', 140, 270);
  text('Maze', 200, 230);
  text('Moving \nBall', 263, 270);
}

//Typing exercise
function screen2() {
  background('#3AAFA9');
  fill(0);
  text(typing.word, width / 2, height / 2 - 20);
  fill(typing.chatBoxColor);
  rect(50, height / 2, 300, 40);
  fill(0);
  text(typing.userInput, width / 2, height / 2 + 20);
  backButton(290, 340, 100, 50);
  text(`WPM: ${typing.wpm}`, width / 2, height - 20);
}

function pickRandomWord() {
  let words = ["Precision", "Computer", "Programming", "Development", "Interface"];
  typing.word = random(words);
  while (typing.word === typing.previousWord) {
      typing.word = random(words);
  }
  typing.previousWord = typing.word;
}

function checkInput() {
  if (typing.userInput === typing.word) {
    typing.chatBoxColor = color(0, 255, 0); 
    positiveSound.play();
    typing.charactersTyped += typing.word.length;
    const elapsedMinutes = (millis() - typing.startTime) / 1000 / 60;
    typing.wpm = Math.round((typing.charactersTyped / 5) / elapsedMinutes);
  } else {
    typing.chatBoxColor = color(255, 0, 0);
    negativeSound.play();
  }
  setTimeout(resetChatBox, 1000);
}
function resetChatBox() {
  typing.userInput = "";
  typing.chatBoxColor = 255;
  pickRandomWord();
  typing.startTime = millis();
  typing.charactersTyped = 0;
}

//End Typing exercise

//Sorting exercise
function screen3() {
  background('#3AAFA9');

  if (gameActive) {
    displayShapes();
    displayOutlines();
    displayStopwatch();
  }
  if (dragging && draggedShape !== null) {
    shapes[draggedShape].x = mouseX;
    shapes[draggedShape].y = mouseY;
  }
  backButton(290, 10, 100, 50);
}

function startRound() {
  shapes = [];
  outlines = [];
  generateShapes();
  shapes.forEach(shape => (shape.matched = shape.locked = false));
  roundStartTime = millis();  
  elapsedTime = 0; 
}

function generateShapes() {
  const availableShapes = shuffle([0, 1, 2, 3, 4, 5], true);
  const availableOutlines = shuffle([0, 1, 2, 3, 4, 5], true);

  for (let i = 0; i < 6; i++) {
    const x = width / 4 * (i < 3 ? i + 1 : i - 2);
    const y = i < 3 ? height / 4 : height / 2;
    shapes.push({ x, y, type: availableShapes[i], matched: false, locked: false });
  }

  for (let i = 0; i < 3; i++) {
    outlines.push({ x: width / 4 * (i + 1), y: height - 50, type: availableOutlines[i] });
  }
}

function displayShapes() {
  shapes.forEach(shape => {
    fill('#af3a40');
    noStroke();
    drawShape(shape);
  });
}

function displayOutlines() {
  outlines.forEach((outline, i) => {
    const size = 60;
    const isDragging = dragging && draggedShape === i;

    if (!shapes.some(shape => shape.type === outline.type && shape.matched && shape.locked)) {
      if (outline.y === height - 50) {
        fill(255, 150);
        stroke(0);
      } else {
        noFill();
        stroke(isDragging ? color(150) : color(0));
      }
      drawShape(outline, size);
    }
  });
}
function displayStopwatch() {
  const currentTime = millis();
  elapsedTime = round((currentTime - roundStartTime) / 1000);
  textSize(16);
  fill(0);
  text(`Time: ${elapsedTime} seconds`,65, 20);
}

function drawShape(s, size = 30, fillColor = null) {
  if (fillColor) fill(fillColor);

  switch (s.type) {
    case 0: ellipse(s.x, s.y, size, size); break;
    case 1: rect(s.x - size / 2, s.y - size / 2, size, size); break;
    case 2: triangle(s.x, s.y - size / 2, s.x - size / 2, s.y + size / 2, s.x + size / 2, s.y + size / 2); break;
    case 3: drawPolygon(s.x, s.y, size / 2, 5); break;
    case 4: drawPolygon(s.x, s.y, size / 2, 6); break;
    case 5: drawDiamond(s.x, s.y, size / 2); break;
  }
}
function drawPolygon(x, y, r, sides) {
  beginShape();
  for (let i = 0; i < sides; i++) vertex(x + cos((TWO_PI / sides) * i) * r, y + sin((TWO_PI / sides) * i) * r);
  endShape(CLOSE);
}
function drawDiamond(x, y, r) {
  beginShape();
  vertex(x, y - r);
  vertex(x + r, y);
  vertex(x, y + r);
  vertex(x - r, y);
  endShape(CLOSE);
}

//End Sorting Screen

//Maze screen
function screen4() {
  backButton(300, 2, 97, 35);

    background(150);
    //Draw the grid
    for (let i = 0; i < grid.length; i++) {
      grid[i].show();
    }
    
    if (mazeGenerated) {
    elapsedTime = millis() - startTime;
    let seconds = int(elapsedTime / 1000);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(16);
    text("Time: " + seconds + " seconds", 10, 10);
    }
    //Draw the regeneration overlay if the maze is being regenerated
    if (!mazeGenerated) {
      fill(0, 0, 0, regenerationOverlay);
      noStroke();
      rect(0, 40, width, height - 40);
  
      //Add text on the regeneration overlay
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(24);
      text("Maze Generating . . .", width / 2, height / 2);
      if (winTextDisplayed) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(24);
      text("You Win!", 200, 150);
    }
    }
  
    //DFS algorithm for maze generation
    if (!mazeGenerated && stack.length > 0) {
      let current = stack[stack.length - 1];
      let next = current.checkNeighbors();
  
      if (next) {
        next.visited = true;
  
        //Remove the walls between the current and next cell
        removeWalls(current, next);
  
        stack.push(next);
      } else {
        //If no neighbors are available, backtrack
        stack.pop();
      }
    } else if (!mazeGenerated) {
      //Maze generation is complete
      mazeGenerated = true;
      winTextDisplayed = false;
      //Create player at the top-left corner
      player = new Player(0, 0); //Pass the initial position
      startTime = millis(); //Start the timer
    }

    //Draw the player if it exists and has not reached the endpoint
    if (player && !playerReachedEndpoint) {
      player.show();
  
      //Check if the player has reached the endpoint
      if (player.x === endpoint.x && player.y === endpoint.y) {
        noLoop(); //Stop the draw loop
        playerReachedEndpoint = true; //Set the flag
        winTextDisplayed = true;
  
        //Delete the player element
        player = undefined;
  
        //Regenerate maze and reset player position
        resetMaze();
      }
  
      //Move the player based on arrow key input
      player.move();
    }
  }

  function resetMaze() {
    stack = [];
    mazeGenerated = false;
    playerReachedEndpoint = false; //Reset the flag
  
    //Reset player to the top-left corner
    player = new Player(0, 0);
  
    //Reset grid cells
    grid = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let cell = new Cell(i, j);
        grid.push(cell);
      }
  }
  
    //Start DFS algorithm from the top-left cell of the grid
    let start = grid[0];
    start.visited = true;
    stack.push(start);
  
    //Create endpoint at the bottom-left corner
    endpoint = createVector(cols - 1, rows - 1);
  
    loop(); //Restart the draw loop
  }

  class Cell {
    constructor(i, j) {
      this.i = i;
      this.j = j;
      this.visited = false;
  
      //Walls: [top, right, bottom, left]
      this.walls = [true, true, true, true];
    }
  
    show() {
      let x = this.i * w;
      let y = this.j * w + 2 * w;
  
      stroke(0);
      strokeWeight(2);
      
      if (this.walls[0]) {
        line(x, y, x + w, y);
      }
      if (this.walls[1]) {
        line(x + w, y, x + w, y + w);
      }
      if (this.walls[2]) {
        line(x + w, y + w, x, y + w);
      }
      if (this.walls[3]) {
        line(x, y + w, x, y);
      }
  
      if (this.visited) {
        noStroke();
        fill(17, 100, 102, 100);
        rect(x, y, w, w);
      }
      //Change the color of the start cell to green
      if (this.i === 0 && this.j === 0) {
        fill(0, 255, 0);
        rect(x, y, w, w);
      }
  
      //Change the color of the end cell to red
      if (this.i === cols - 1 && this.j === rows - 1) {
        fill(255, 0, 0);
        rect(x, y, w, w);
      }
    }
  
    index(i, j) {
      if (i < 0 || j < 0 || i >= cols || j >= rows) {
        return -1;
      }
      return i + j * cols;
    }
  
    checkNeighbors() {
      let neighbors = [];
  
      let top = grid[this.index(this.i, this.j - 1)];
      let right = grid[this.index(this.i + 1, this.j)];
      let bottom = grid[this.index(this.i, this.j + 1)];
      let left = grid[this.index(this.i - 1, this.j)];
  
      if (top && !top.visited) {
        neighbors.push(top);
      }
      if (right && !right.visited) {
        neighbors.push(right);
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      if (left && !left.visited) {
        neighbors.push(left);
      }
  
      if (neighbors.length > 0) {
        let r = floor(random(0, neighbors.length));
        return neighbors[r];
      } else {
        return undefined;
      }
    }
    hasUnvisitedNeighbors() {
    let neighbors = this.getAdjacentCells();
    for (let neighbor of neighbors) {
      if (!neighbor.visited) {
        return true;
      }
    }
    return false;
  }
    getAdjacentCells() {
      let neighbors = [];
  
      let top = grid[this.index(this.i, this.j - 1)];
      let right = grid[this.index(this.i + 1, this.j)];
      let bottom = grid[this.index(this.i, this.j + 1)];
      let left = grid[this.index(this.i - 1, this.j)];
  
      if (top) {
        neighbors.push(top);
      }
      if (right) {
        neighbors.push(right);
      }
      if (bottom) {
        neighbors.push(bottom);
      }
      if (left) {
        neighbors.push(left);
      }
  
      return neighbors;
    }
  }
  
  function removeWalls(current, next) {
    let x = current.i - next.i;
    if (x === 1) {
      current.walls[3] = false;
      next.walls[1] = false;
    } else if (x === -1) {
      current.walls[1] = false;
      next.walls[3] = false;
    }
  
    let y = current.j - next.j;
    if (y === 1) {
      current.walls[0] = false;
      next.walls[2] = false;
    } else if (y === -1) {
      current.walls[2] = false;
      next.walls[0] = false;
    }
  }
  
  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.moveLeft = false;
      this.moveRight = false;
      this.moveUp = false;
      this.moveDown = false;
    }
    //Creates an ellipse to represent the player
    show() {
      if (mazeGenerated) {
        fill(0, 0, 255);
        noStroke();
        ellipse(this.x * w + w / 2, (this.y + 2) * w + w / 2, w / 2);
      }
    }
  
    //Checks walls in the direction being moved and adjusts player position if there are no walls in that direction
    move() {
      //Get adjacent cells without checking if they are visited
      let adjacentCells = grid[getIndex(this.x, this.y)].getAdjacentCells();
  
      //Move the player based on arrow key input
      if (this.moveLeft && this.x > 0 && !grid[getIndex(this.x, this.y)].walls[3]) {
        this.x -= 1;
      } else if (this.moveRight && this.x < cols - 1 && !grid[getIndex(this.x, this.y)].walls[1]) {
        this.x += 1;
      } else if (this.moveUp && this.y > 0 && !grid[getIndex(this.x, this.y)].walls[0]) {
        this.y -= 1;
      } else if (this.moveDown && this.y < rows - 1 && !grid[getIndex(this.x, this.y)].walls[2]) {
        this.y += 1;
      }
    }
  }
  
  
  function getIndex(i, j) {
    if (i < 0 || j < 0 || i >= cols || j >= rows) {
      return -1;
    }
    return i + j * cols;
  }

//End Maze

//Moving ball exercise
function screen5() {
  background('#4E4E50');
  checkClick();
  fill(ballGame.isGreen ? '#5CDB95' : 'red');
  ellipse(ballGame.ball.x, ballGame.ball.y, ballGame.ball.size, ballGame.ball.size);
  ballGame.ball.x += ballGame.ball.speed;
  textSize(24);
  fill('white');
  text(`Points: ${ballGame.points}`, 60, 30);
  text(`Strikes: ${ballGame.strikes}`, 60, 60);
  if (ballGame.gameOverFlag) {
    fill(255);
    rect(width / 2 - 60, height / 2 + 50, 120, 40); 
    fill(0); 
    textSize(18);
    textAlign(CENTER, CENTER);
    text('Restart', width / 2, height / 2 + 70);
    noLoop();
  }
  checkBounds();
  backButton(290, 340, 100, 50);
}

//reset moving ball game
function resetBallGame() {
  ballGame.points = 0;
  ballGame.strikes = 0;
  ballGame.ball.speed = 0; 
  resetBall();
  ballGame.lastClickTime = millis();
  ballGame.gameOverFlag = false;
  loop(); 
}

//reset the moving ball
function resetBall() {
  ballGame.ball.x = random([0,400]);
  ballGame.ball.y = random(height - ballGame.ball.size);
  ballGame.ball.speed = (Math.abs(ballGame.ball.speed) + 0.5) * ((ballGame.ball.x == 0)? 1 : -1);
  ballGame.isGreen = random() > 0.5;
}

//To check if the ball in moving ball is clicked
function checkClick() {
  let d = dist(mouseX, mouseY, ballGame.ball.x, ballGame.ball.y);
  if (mouseIsPressed && d < ballGame.ball.size / 2) {
    if ((ballGame.isGreen && d < ballGame.ball.size / 2) || (!ballGame.isGreen && d >= ballGame.ball.size / 2)) {
      ballGame.points++; 
    } else {
      ballGame.strikes++;
    }
    if (ballGame.strikes >= 3) {
      ballGame.gameOverFlag = true;
    }
    else{
      resetBall();
    }
  } 
}

function checkBounds(){
  if (ballGame.ball.x > 400 || ballGame.ball.x < 0){
    if (!ballGame.isGreen){
      ballGame.points++;
    }
    else{
      ballGame.strikes++;
      if (ballGame.strikes >= 3){
        ballGame.gameOverFlag = true;
        return;
      }
    }
    resetBall();
  }
}

//End Moving ball exercise

function mousePressed(){
  if (mode == 0) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].hover) {
        mode = i + 1;
        buttons[i].setupFunction();
      }
    }
  }
  if (mode == 2) {
    if (!gameActive) return;
      for (let i = 0; i < shapes.length; i++) {
        if (!shapes[i].matched && dist(mouseX, mouseY, shapes[i].x, shapes[i].y) < 15) {
          dragging = true;
          draggedShape = i;
          break;
        }
      }
  }
  if (mode == 4) {
    if (ballGame.gameOverFlag && mouseX > width / 2 - 60 && mouseX < width / 2 + 60 && mouseY > height / 2 + 50 && mouseY < height / 2 + 90) {
    resetBallGame(); 
    }
  }
}

function mouseReleased() {
  if (!gameActive) return;

  if (dragging && draggedShape !== null) {
    const matchedOutline = outlines.find(outline =>
      !shapes.some(shape => shape.matched && shape.locked && shape.type === outline.type) &&
      dist(outline.x, outline.y, shapes[draggedShape].x, shapes[draggedShape].y) < 15
    );
    
    if (matchedOutline && shapes[draggedShape].type === matchedOutline.type) {
      shapes[draggedShape].matched = shapes[draggedShape].locked = true;
      correctMatches++;
      if (correctMatches === 3) {
        positiveSound.play(); 
        gameActive = false;
        setTimeout(() => {
          gameActive = true;
          startRound();
          correctMatches = 0;
        }, 1000);
      }
    } else {
      negativeSound.play(); 
      gameActive = false;
      setTimeout(() => {
        gameActive = true;
        startRound();
        correctMatches = 0;
      }, 1000);
    }
  }
  dragging = false;
  draggedShape = null;
}

function keyPressed() {
  if (mode == 1) {
    if (keyCode === BACKSPACE) {
      typing.userInput = typing.userInput.slice(0, -1);
    } else if (keyCode === ENTER) {
      checkInput();
    } else if (keyCode !== SHIFT && keyCode !== CONTROL && keyCode !== ALT) {
      typing.userInput += key;
    }
  }
  if (mode == 3) {
    if (mazeGenerated) {
      let currentCell = grid[getIndex(player.x, player.y)];
      if (keyCode === LEFT_ARROW && player.x > 0 && !currentCell.walls[3]) {
        player.x -= 1;
      } else if (keyCode === RIGHT_ARROW && player.x < cols - 1 && !currentCell.walls[1]) {
        player.x += 1;
      } else if (keyCode === UP_ARROW && player.y > 0 && !currentCell.walls[0]) {
        player.y -= 1;
      } else if (keyCode === DOWN_ARROW && player.y < rows - 1 && !currentCell.walls[2]) {
        player.y += 1;
      }
    }
  }
}

//resets back to main screen
function mode0() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].hover = false;
  }
  textAlign(CENTER, CENTER);
  if (mode == 4) {
   resetBallGame();   
  }
  mode = 0;
  removeElements();
}
