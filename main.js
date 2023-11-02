//Triangle coordinates
var mode = 0;
const tri1 = [150, 190, 200, 90, 250, 190];
var hover1 = false;
const tri2 = [90, 300, 140, 200, 190, 300];
var hover2 = false;
const tri3 = [150, 200, 200, 300, 250, 200];
var hover3 = false;
const tri4 = [210, 300, 260, 200, 310, 300];
var hover4 = false;

//Moving ball vars
let ballSize = 50;
let ballX, ballY;
let isGreen;
let points = 0;
let strikes = 0;
let lastClickTime;
let gameOverFlag = false;

function setup() {
  createCanvas(400, 400);
  resetBall();
  lastClickTime = millis();
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

//Home screen
function screen1() {
  background(204, 128, 255);
  textSize(25);
  text('Rehabilitation App', 100, 50);
  hover();
  if (hover1) fill(175);
  else fill(255);
  triangle(150, 190, 200, 90, 250, 190);
  if (hover2) fill(175);
  else fill(255);
  triangle(90, 300, 140, 200, 190, 300);
  if (hover3) fill(175);
  else fill(255);
  triangle(150, 200, 200, 300, 250, 200);
  if (hover4) fill(175);
  else fill(255);
  triangle(210, 300, 260, 200, 310, 300);
  fill(0);
  textSize(16);
  text('Typing', 178, 160);
  text('Sorting', 115, 270);
  text('Progress', 170, 230);
  text('Moving \n   Ball', 235, 270);
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
  background(255, 255, 255);
  textSize(25);
  text('Typing', 100, 50);
  button = createButton('Back');
  button.size(100,50);
  button.position(290, 340);
  button.mousePressed(mode0);
}

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
  text(`Points: ${points}`, 20, 30);
  text(`Strikes: ${strikes}`, 20, 60);
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

function resetGame() {
  points = 0;
  strikes = 0;
  resetBall();
  lastClickTime = millis();
  gameOverFlag = false;
  loop(); 
}
function resetBall() {
  ballX = random(width - ballSize);
  ballY = random(height - ballSize);
  isGreen = random() > 0.5;
}
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
function hover(){
  if (pointInTriangle(mouseX, mouseY, tri1)) {
    hover1 = true;
  } else if (pointInTriangle(mouseX, mouseY, tri2)) {
    hover2 = true;
  } else if (pointInTriangle(mouseX, mouseY, tri3)) {
    hover3 = true;
  } else if (pointInTriangle(mouseX, mouseY, tri4)) {
    hover4 = true;
  }
}

//reset to check hover again
function hoverReset(){
  hover1 = false;
  hover2 = false;
  hover3 = false;
  hover4 = false;
}

function mousePressed(){
  if (mode == 0) {
    if (pointInTriangle(mouseX, mouseY, tri1)) {
      // Clicked inside the first triangle
      mode = 1; // Change the mode to screen 2
    } else if (pointInTriangle(mouseX, mouseY, tri2)) {
      // Clicked inside the second triangle
      mode = 2; // Change the mode to screen 3
    } else if (pointInTriangle(mouseX, mouseY, tri3)) {
      // Clicked inside the third triangle
      mode = 3; // Change the mode to screen 4
    } else if (pointInTriangle(mouseX, mouseY, tri4)) {
      // Clicked inside the fourth triangle
      mode = 4; // Change the mode to screen 5
    }
  }
  if (mode == 4) {
    if (gameOverFlag && mouseX > width / 2 - 60 && mouseX < width / 2 + 60 && mouseY > height / 2 + 50 && mouseY < height / 2 + 90) {
    resetGame(); 
    }
  }
}

function mode0() {
  mode = 0;
  removeElements();
}
