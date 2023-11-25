class TriangleButton {
  constructor(points, setupFunction) {
    this.points = points;
    this.hover = false;
    this.setupFunction = setupFunction;
  }

  display() {
    if (this.hover) {
      fill('#2B7A78');
    } else {
      fill('#17252A');
    }
    stroke('#EDF5E1');
    strokeWeight(2);
    triangle(...this.points);
    strokeWeight(0);
  }

  checkHover() {
    this.hover = this.pointInTriangle(mouseX, mouseY);
  }

  pointInTriangle(x, y) {
    let x1 = this.points[0];
    let y1 = this.points[1];
    let x2 = this.points[2];
    let y2 = this.points[3];
    let x3 = this.points[4];
    let y3 = this.points[5];

    // Calculate coordinates
    let alpha = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) /
      ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
    let beta = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) /
      ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
    let gamma = 1 - alpha - beta;
    
    // Check if the point is inside the triangle
    return alpha > 0 && beta > 0 && gamma > 0;
  }
}
