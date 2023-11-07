//Triangle coordinates
var mode = 0;
let triangles = [
  { points: [150, 190, 200, 90, 250, 190], hover: false, setupFunction: screen2Setup },
  { points: [90, 300, 140, 200, 190, 300], hover: false, setupFunction: screen3Setup },
  { points: [150, 200, 200, 300, 250, 200], hover: false, setupFunction: screen4Setup },
  { points: [210, 300, 260, 200, 310, 300], hover: false, setupFunction: screen5Setup }
];

//Moving ball vars
let ballSize = 50;
let ballX, ballY;
let isGreen;
let points = 0;
let strikes = 0;
let lastClickTime;
let gameOverFlag = false;

//Typing practice vars
let word;
let userInput = "";
let chatBoxColor = 255;

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
  resetBall();
  lastClickTime = millis();
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
  text(word, width / 2, height / 2 - 20);
  fill(chatBoxColor);
  rect(50, height / 2, 300, 40);
  fill(0);
  text(userInput, width / 2, height / 2 + 20);
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

function pickRandomWord() {
  let words = ["PRECISION", "COMPUTER", "PROGRAMMING", "DEVELOPMENT", "INTERFACE"];
  word = random(words);
}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    userInput = userInput.slice(0, -1);
  } else if (keyCode === ENTER) {
    checkInput();
  } else if (keyCode !== SHIFT && keyCode !== CONTROL && keyCode !== ALT) {
    userInput += key;
  }
}

function checkInput() {
  if (userInput === word) {
    chatBoxColor = color(0, 255, 0); 
  } else {
    chatBoxColor = color(255, 0, 0);
  }
  setTimeout(resetChatBox, 1000);
}
function resetChatBox() {
  userInput = "";
  chatBoxColor = 255;
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
  textSize(25);
  text('Progress', 100, 50);
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

//Moving ball exercise
function screen5() {
  background(0); 
  checkClick();
  fill(isGreen ? 'green' : 'red');
  ellipse(ballX, ballY, ballSize, ballSize);
  textSize(24);
  fill('white');
  text(`Points: ${points}`, 60, 30);
  text(`Strikes: ${strikes}`, 60, 60);
  if (gameOverFlag) {
    fill(255);
    rect(width / 2 - 60, height / 2 + 50, 120, 40); 
    fill(0); 
    textSize(18);
    textAlign(CENTER, CENTER);
    text('Restart', width / 2, height / 2 + 70);
  }
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

//reset moving ball game
function resetBallGame() {
  points = 0;
  strikes = 0;
  resetBall();
  lastClickTime = millis();
  gameOverFlag = false;
  loop(); 
}

//reset the moving ball
function resetBall() {
  ballX = random(width - ballSize);
  ballY = random(height - ballSize);
  isGreen = random() > 0.5;
}

//To check if the ball in moving ball is clicked
function checkClick() {
  let d = dist(mouseX, mouseY, ballX, ballY);
  if (mouseIsPressed && d < ballSize / 2) {
    if ((isGreen && d < ballSize / 2) || (!isGreen && d >= ballSize / 2)) {
      points++; 
      lastClickTime = millis(); 
    } else {
      strikes++;
      lastClickTime = millis();
    }
    if (strikes >= 3) {
      gameOverFlag = true;
      noLoop(); 
    }
    else{
      resetBall();
    }
  } else {
    if (millis() - lastClickTime > 4000 && !isGreen) {
      resetBall(); 
      lastClickTime = millis(); 
    }
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
    if (gameOverFlag && mouseX > width / 2 - 60 && mouseX < width / 2 + 60 && mouseY > height / 2 + 50 && mouseY < height / 2 + 90) {
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
