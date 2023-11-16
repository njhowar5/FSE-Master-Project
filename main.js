//Triangle coordinates
var mode = 0;
let triangles = [
  { points: [150, 190, 200, 90, 250, 190], hover: false, setupFunction: screen2Setup },
  { points: [90, 300, 140, 200, 190, 300], hover: false, setupFunction: screen3Setup },
  { points: [150, 200, 200, 300, 250, 200], hover: false, setupFunction: screen4Setup },
  { points: [210, 300, 260, 200, 310, 300], hover: false, setupFunction: screen5Setup }
];

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
    userInput: '',
    chatBoxColor: 255,
};

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
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
}
//Sorting Setup
function screen3Setup() {

}
//Progress Setup
function screen4Setup() {

}
//Moving Ball Setup
function screen5Setup() {
  resetBallGame();
  ballGame.lastClickTime = millis();
}

//Home screen
function screen1() {
  background(204, 128, 255);
  textSize(25);
  text('Rehabilitation App', 200, 50);
  hover();
  for (let i = 0; i < triangles.length; i++) {
    if (triangles[i].hover) {
      fill(175);
    } else {
      fill(255);
    }
    triangle(...triangles[i].points); // Spread the points array
  }
  fill(0);
  textSize(16);
  text('Typing', 200, 160);
  text('Sorting', 140, 270);
  text('Progress', 200, 230);
  text('Moving \nBall', 263, 270);
  hoverReset();
}

// Function to check if a point (x, y) is inside a triangle defined by its vertices
function pointInTriangle(x, y, vertices) {
  let x1 = vertices[0];
  let y1 = vertices[1];
  let x2 = vertices[2];
  let y2 = vertices[3];
  let x3 = vertices[4];
  let y3 = vertices[5];

  // Calculate coordinates
  let alpha = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) /
    ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
  let beta = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) /
    ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
  let gamma = 1 - alpha - beta;
  // Check if the point is inside the triangle
  return alpha > 0 && beta > 0 && gamma > 0;
}
//End home screen

//Typing exercise
function screen2() {
  background(240);
  fill(0);
  text(typing.word, width / 2, height / 2 - 20);
  fill(typing.chatBoxColor);
  rect(50, height / 2, 300, 40);
  fill(0);
  text(typing.userInput, width / 2, height / 2 + 20);
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

function pickRandomWord() {
  let words = ["PRECISION", "COMPUTER", "PROGRAMMING", "DEVELOPMENT", "INTERFACE"];
  typing.word = random(words);
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    typing.userInput = typing.userInput.slice(0, -1);
  } else if (keyCode === ENTER) {
    checkInput();
  } else if (keyCode !== SHIFT && keyCode !== CONTROL && keyCode !== ALT) {
    typing.userInput += key;
  }
}

function checkInput() {
  if (typing.userInput === typing.word) {
    typing.chatBoxColor = color(0, 255, 0); 
  } else {
    typing.chatBoxColor = color(255, 0, 0);
  }
  setTimeout(resetChatBox, 1000);
}
function resetChatBox() {
  typing.userInput = "";
  typing.chatBoxColor = 255;
  pickRandomWord();
}

//End Typing exercise

//Sorting exercise
function screen3() {
  background(255, 255, 255);
  textSize(25);
  text('Sorting', 100, 50);
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

//Progress screen
function screen4() {
  background(255, 255, 255);
  fill(250);
  rect(100, 100, 200);
  fill(0);
  textSize(25);
  text('Progress', 200, 50);
  text(`Streak: ${progress.streak}`, 200, 130);
  text(`Typing: ${progress.typing}`, 200, 170);
  text(`Sorting: ${progress.sorting}`, 200, 210);
  text(`Moving Ball: ${progress.movingBall}`, 200, 250);
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

//Moving ball exercise
function screen5() {
  background(0);
  checkClick();
  fill(ballGame.isGreen ? 'green' : 'red');
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
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
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

//checks if mouse is hovering over screen buttons
function buttonCheck(x,y,w,h){
  if ((mouseX >= x && mouseX <= x + w) && (mouseY >= y && mouseY <= y + h)) return true;
  else return false;
}

//To check if the mouse is hovering over the triangles
function hover() {
  for (let i = 0; i < triangles.length; i++) {
    if (pointInTriangle(mouseX, mouseY, triangles[i].points)) {
      triangles[i].hover = true;
    }
  }
}


//reset to check hover again
function hoverReset() {
  for (let i = 0; i < triangles.length; i++) {
    triangles[i].hover = false;
  }
}

function mousePressed(){
  if (mode == 0) {
    for (let i = 0; i < triangles.length; i++) {
      if (pointInTriangle(mouseX, mouseY, triangles[i].points)) {
        mode = i + 1;
        triangles[i].setupFunction();
      }
    }
  }
  if (mode == 4) {
    if (ballGame.gameOverFlag && mouseX > width / 2 - 60 && mouseX < width / 2 + 60 && mouseY > height / 2 + 50 && mouseY < height / 2 + 90) {
    resetBallGame(); 
    }
  }
}

//resets back to main screen
function mode0() {
  if (mode == 4) {
   resetBallGame();   
  }
  mode = 0;
  removeElements();
}
