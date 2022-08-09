function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let grid;
let cols;
let rows;
let resolution = 10;
let mode = 2;
let res_changed = 0;
let status_config = 0;
let speed = 5;
let shape = 3;
let min_born = 4;
let max_born = 4;
let min_die = 2;
let max_die = 6;
let go = 1;
let menu_scale = 1;

// best settings
// 3 4 4 2 6
// 6 2 2 2 5
// 4 3 3 1 4
// 5 3 4 2 5

function setup() {
  frameRate(speed);
  createCanvas(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );
  if (shape == 6) {
    cols = floor((width - resolution * 4) / resolution / 3);
    rows = floor((height - resolution * 4) / resolution / 0.867);
  }
  if (shape == 5) {
    cols = floor((width - resolution * 2) / resolution / 1.17);
    rows = floor((height - resolution * 2) / resolution / 1.17);
  }
  if (shape == 4) {
    cols = floor((width - resolution * 4) / resolution);
    rows = floor((height - resolution * 4) / resolution);
  }
  if (shape == 3) {
    cols = floor((width - resolution * 4) / resolution / 0.74);
    rows = floor((height - resolution * 4) / resolution / 1.74);
  }
  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }

  res_slider = createCSlider(4, 40, resolution);
  spd_slider = createCSlider(1, 40, speed);
  shp_slider = createCSlider(3, 6, shape, 1);
  min_born_slider = createCSlider(0, 12, min_born);
  max_born_slider = createCSlider(0, 12, max_born);
  min_die_slider = createCSlider(0, 13, min_die);
  max_die_slider = createCSlider(0, 13, max_die);
}

function draw() {
  background(0);

  if (shape == 6) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = resolution * 4 + i * resolution * 3;
        let y = resolution * 4 + j * resolution * 0.867;
        if (j % 2 == 0) {
          x = resolution * 4 + i * resolution * 3 - resolution * 1.5;
        }
        if (grid[i][j] > 0) {
          fill(0, grid[i][j] * 200, 0);
          stroke(0);
          polygon(x, y, resolution, 6);
        }
      }
    }
  }

  if (shape == 5) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let k = 1.17;
        let x = resolution * 2 + i * resolution * k;
        let y = resolution * 2 + j * resolution * k;
        if (grid[i][j] == 1) {
          fill(0, grid[i][j] * 200, 0);
          stroke(0);
          rot = 0;
          if (i % 2 == 0 && j % 2 == 0) {
            rot = PI / 2 + PI / 4;
          }
          if (i % 2 == 1 && j % 2 == 0) {
            rot = PI / 4;
          }
          if (i % 2 == 0 && j % 2 == 1) {
            rot = PI + PI / 4;
          }
          if (i % 2 == 1 && j % 2 == 1) {
            rot = 2 * PI - PI / 4;
          }
          //rot = (i % 2 ) * PI/2 + PI/2 +PI/4;
          poly5(x, y, resolution - 1, resolution - 1, rot);
        }
      }
    }
  }
  if (shape == 4) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = resolution * 2 + i * resolution;
        let y = resolution * 2 + j * resolution;
        if (grid[i][j] == 1) {
          fill(0, grid[i][j] * 200, 0);
          stroke(0);
          rect(x, y, resolution - 1, resolution - 1);
        }
      }
    }
  }

  if (shape == 3) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let k = 0.74;
        let x = resolution * 3 + i * resolution * k;
        let y = resolution * 3 + j * resolution * (1 + k);
        if (i % 2 != 0) {
          y = resolution * 3.85 + j * resolution * (1 + k);
          x = resolution * 2.74 + i * resolution * k;
        }
        if (floor(i / 2) % 2 != 0) {
          y = y + resolution * 0.88;
        }
        if (grid[i][j] > 0) {
          fill(0, grid[i][j] * 200, 0);
          stroke(0);
          if (i % 2 == 0) {
            polygon(x, y, resolution, 3, 0);
          } else {
            polygon(x, y, resolution, 3, PI);
          }
        }
      }
    }
  }

  let next = make2DArray(cols, rows);

  // Compute next based on grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      // Count live neighbors!
      let sum = 0;
      let neighbors = countNeighbors(grid, i, j);

      if (state == 0 && neighbors >= min_born && neighbors <= max_born) {
        next[i][j] = 1;
      } else if (state > 0 && (neighbors <= min_die || neighbors >= max_die)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  if (go) {
    grid = next;
  }
  push();
  if (width / 250 > 2 && height / 300 > 2) {
    menu_scale = floor(min(width / 250, height / 300));
  }

  scale(menu_scale);

  if (status_config) {
    fill(200, 200, 200);
    stroke(1);
    rect(0, 0, 250, 300);
    rect(10, 10, 30, 30);
    line(15, 15, 35, 35);
    line(15, 35, 35, 15);
    fill(0);
    noStroke(50);
    res_slider.position(10, 80);
    res_slider.setScale(menu_scale);
    text("size", res_slider.x * 2 + res_slider.width, 95);
    spd_slider.position(10, 105);
    spd_slider.setScale(menu_scale);
    text("speed", res_slider.x * 2 + spd_slider.width, 120);
    shp_slider.position(10, 130);
    shp_slider.setScale(menu_scale);
    text(
      shp_slider.value() + " corners",
      shp_slider.x * 2 + shp_slider.width,
      145
    );

    min_born_slider.position(10, 155);
    min_born_slider.setScale(menu_scale);
    text(
      min_born_slider.value() + " min to born",
      min_born_slider.x * 2 + min_born_slider.width,
      170
    );
    max_born_slider.position(10, 180);
    max_born_slider.setScale(menu_scale);
    text(
      max_born_slider.value() + " max to born",
      max_born_slider.x * 2 + max_born_slider.width,
      195
    );
    min_die_slider.position(10, 205);
    min_die_slider.setScale(menu_scale);
    text(
      min_die_slider.value() + " or less to die",
      min_die_slider.x * 2 + min_die_slider.width,
      220
    );
    max_die_slider.position(10, 230);
    max_die_slider.setScale(menu_scale);
    text(
      max_die_slider.value() + " or more to die",
      max_die_slider.x * 2 + max_die_slider.width,
      245
    );
    fill(200, 200, 200);
    stroke(1);

    rect(10, 270, 35, 20, 5);
    noStroke(0);
    fill(0);
    if (go) {
      text("stop", 16, 283);
    } else {
      text("start", 15, 283);
    }

    fill(200, 200, 200);
    stroke(1);
    rect(50, 270, 35, 20, 5);
    noStroke(0);
    fill(0);
    text("clear", 56, 283);

    fill(200, 200, 200);
    stroke(1);
    rect(90, 270, 35, 20, 5);
    noStroke(0);
    fill(0);
    text("rand", 96, 283);
    
    text("Presets:", 10, 65);
    fill(200, 200, 200);
    stroke(1);
    rect(70, 50, 20, 20, 5);
    noStroke(0);
    fill(0);
    text("3", 77, 65);
    fill(200, 200, 200);
    stroke(1);
    rect(100, 50, 20, 20, 5);
    noStroke(0);
    fill(0);
    text("4", 107, 65);
    fill(200, 200, 200);
    stroke(1);
    rect(130, 50, 20, 20, 5);
    noStroke(0);
    fill(0);
    text("5", 137, 65);
    fill(200, 200, 200);
    stroke(1);
    rect(160, 50, 20, 20, 5);
    noStroke(0);
    fill(0);
    text("6", 167, 65);


    if (resolution != res_slider.value()) {
      resolution = res_slider.value();
      res_changed = 1;
    }
    if (speed != spd_slider.value()) {
      speed = spd_slider.value();
      frameRate(speed);
    }
    if (shape != shp_slider.value()) {
      shape = shp_slider.value();
      //if (shape == 5) {
      //  shape = 6;
      //}
      res_changed = 1;
    }
    if (min_born != min_born_slider.value()) {
      min_born = min_born_slider.value();
    }
    if (max_born != max_born_slider.value()) {
      max_born = max_born_slider.value();
    }
    if (min_die != min_die_slider.value()) {
      min_die = min_die_slider.value();
    }
    if (max_die != max_die_slider.value()) {
      max_die = max_die_slider.value();
    }
  } else {
    //noFill();
    fill(0);
    stroke(0, 100, 0);
    rect(10, 10, 30, 30);
    rect(15, 17, 20, 1);
    rect(15, 24, 20, 1);
    rect(15, 31, 20, 1);
    res_slider.position(-20, -80);
    spd_slider.position(-20, -80);
    shp_slider.position(-20, -80);

    min_born_slider.position(-20, -155);
    max_born_slider.position(-20, -180);
    min_die_slider.position(-20, -205);
    max_die_slider.position(-20, -130);

    if (res_changed == 1) {
      setup();
      res_changed = 0;
    }
  }
  pop();
}

function mousePressed() {
  let mouse_done = 0;
  let scaleX = mouseX / menu_scale;
  let scaleY = mouseY / menu_scale;

  // Check if mouse is inside the circle
  let d = dist(scaleX, scaleY, 25, 25);
  if (d < 15) {
    status_config = 1 - status_config;
    mouse_done = 1;
  }
  if (status_config == 1) {
    if (scaleX > 70 && scaleX < 90 && scaleY > 50 && scaleY < 70) {
      shape = 3;
      min_born = 4;
      max_born = 4;
      min_die = 2;
      max_die = 6;
     
      status_config = 0;
      setup();
      mouse_done = 1;
    }
    if (scaleX > 100 && scaleX < 120 && scaleY > 50 && scaleY < 70) {
      shape = 4;
      min_born = 3;
      max_born = 3;
      min_die = 1;
      max_die = 4;
      
      status_config = 0;
      setup();
      mouse_done = 1;
    }
    if (scaleX > 130 && scaleX < 150 && scaleY > 50 && scaleY < 70) {
      shape = 5;
      min_born = 3;
      max_born = 4;
      min_die = 2;
      max_die = 5;

      status_config = 0;
      setup();
      mouse_done = 1;
    }
    if (scaleX > 160 && scaleX < 180 && scaleY > 50 && scaleY < 70) {
      shape = 6;
      min_born = 2;
      max_born = 2;
      min_die = 2;
      max_die = 5;
      
      status_config = 0;
      setup();
      mouse_done = 1;
    }
    if (scaleX > 10 && scaleX < 45 && scaleY > 270 && scaleY < 290) {
      go = 1 - go;
      mouse_done = 1;
    }
    if (scaleX > 50 && scaleX < 85 && scaleY > 270 && scaleY < 290) {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = 0;
        }
      }
      mouse_done = 1;
    }
    if (scaleX > 90 && scaleX < 125 && scaleY > 270 && scaleY < 290) {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = floor(random(2));
        }
      }
      mouse_done = 1;
    }
  }
  if (mouse_done == 0) {
    if (shape == 4) {
      x = floor((mouseX - resolution * 2) / resolution);
      y = floor((mouseY - resolution * 2) / resolution);
      //console.log(x);
      //console.log(y);
      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[x][y] = 1 - grid[x][y];
      }
    }
    if (shape == 3) {
      let my = mouseY;
      let k = 0.74;
      x = floor((mouseX - resolution * 3) / resolution / k);
      if (floor(x / 2) % 2 != 0) my = my - resolution * 0.88;

      y = floor((my - resolution * 3) / resolution / (1 + k));
      //console.log(x);
      //console.log(y);
      let res_x = -1;
      let res_y = -1;
      let min_dist = resolution * 100;

      for (let i = x - 3; i <= x + 3; i++) {
        for (let j = y - 3; j <= y + 3; j++) {
          let k = 0.74;
          let nx = resolution * 3 + i * resolution * k;
          let ny = resolution * 3 + j * resolution * (1 + k);
          if (i % 2 != 0) {
            ny = resolution * 3.85 + j * resolution * (1 + k);
            nx = resolution * 2.74 + i * resolution * k;
          }
          if (floor(i / 2) % 2 != 0) {
            ny = ny + resolution * 0.88;
          }

          let ndist = dist(mouseX, mouseY, nx, ny);
          if (ndist < min_dist) {
            res_x = i;
            res_y = j;
            min_dist = ndist;
          }
        }
      }
      x = res_x;
      y = res_y;

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[x][y] = 1 - grid[x][y];
      }
    }
    if (shape == 6) {
      y = round((mouseY - resolution * 4) / resolution / 0.867);
      if (y % 2 == 0) {
        x = round((mouseX - resolution * 2.5) / resolution / 3);
      } else {
        x = round((mouseX - resolution * 4) / resolution / 3);
      }

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[x][y] = 1 - grid[x][y];
      }
    }
    if (shape == 5) {
      y = round((mouseY - resolution * 2) / resolution / 1.2);
      x = round((mouseX - resolution * 2) / resolution / 1.2);

      if (x >= 0 && x < cols && y >= 0 && y < rows) {
        grid[x][y] = 1 - grid[x][y];
      }
    }
  }
}

function countNeighbors(grid, x, y) {
  let sum = 0;

  if (shape == 6) {
    if (y % 2 == 0) {
      for (let i = -1; i < 1; i++) {
        for (let j = -2; j < 3; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          if (!(j % 2 == 0) || i > -1) sum += grid[col][row];
        }
      }
    } else {
      for (let i = 0; i < 2; i++) {
        for (let j = -2; j < 3; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          if (!(j % 2 == 0) || i < 1) sum += grid[col][row];
        }
      }
    }
  }

  if (shape == 4) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        sum += grid[col][row];
      }
    }
  }

  if (shape == 5) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        sum += grid[col][row];
      }
    }
    let delta = 0;
    if (x % 2 == 0 && y % 2 == 0) {
      delta = grid[(x + 1 + cols) % cols][(y + 1 + rows) % rows];
    }
    if (x % 2 == 1 && y % 2 == 0) {
      delta = grid[(x + 1 + cols) % cols][(y - 1 + rows) % rows];
    }
    if (x % 2 == 0 && y % 2 == 1) {
      delta = grid[(x - 1 + cols) % cols][(y + 1 + rows) % rows];
    }
    if (x % 2 == 1 && y % 2 == 1) {
      delta = grid[(x - 1 + cols) % cols][(y - 1 + rows) % rows];
    }
    sum -= delta;
  }

  if (shape == 3) {
    if (x % 4 == 2) {
      for (let i = -2; i < 4; i++) {
        for (let j = -1; j < 2; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          if (
            (i == -2 && j > -1) ||
            i == -1 ||
            (i == 2 && j > -1) ||
            i == 0 ||
            (i == 1 && j < 1) ||
            (i == 3 && j == 0)
          )
            sum += grid[col][row];
        }
      }
    }
    if (x % 4 == 0) {
      for (let i = -2; i < 4; i++) {
        for (let j = -2; j < 2; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          if (
            (i == -2 && j > -2 && j < 1) ||
            (i == -1 && j < 1 && j > -3) ||
            (i == 2 && j > -2 && j < 1) ||
            (i == 0 && j > -2) ||
            (i == 1 && j > -2 && j < 1) ||
            (i == 3 && j == -1)
          )
            sum += grid[col][row];
        }
      }
    }
    if (x % 4 == 3) {
      for (let i = -3; i < 3; i++) {
        for (let j = -1; j < 3; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          if (
            (i == -2 && j > -1 && j < 2) ||
            (i == -1 && j < 2 && j > -1) ||
            (i == 2 && j > -1 && j < 2) ||
            (i == 0 && j < 2) ||
            (i == 1 && j > -1 && j < 3) ||
            (i == -3 && j == 1)
          )
            sum += grid[col][row];
        }
      }
    }
    if (x % 4 == 1) {
      for (let i = -3; i < 3; i++) {
        for (let j = -1; j < 2; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          if (
            (i == 2 && j < 1) ||
            i == 1 ||
            (i == -2 && j > -2 && j < 1) ||
            i == 0 ||
            (i == -1 && j > -1) ||
            (i == -3 && j == 0)
          )
            sum += grid[col][row];
        }
      }
    }
  }

  sum -= grid[x][y];
  return sum;
}

function polygon(x, y, radius, npoints, rotate = 0) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a + rotate) * radius;
    let sy = y + sin(a + rotate) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function poly5(x, y, radius, npoints, rotate = 0) {
  let angle = TWO_PI / 6;
  beginShape();
  for (let a = 0; a <= 3; a++) {
    let sx = 0;
    let sy = 0;
    if (a == 1) {
      sx = x + cos(a * angle * 1.08 + rotate) * radius * 0.9;
      sy = y + sin(a * angle * 1.08 + rotate) * radius * 0.9;
    } else if (a == 2) {
      sx = x + cos(a * angle * 0.92 + rotate) * radius * 0.9;
      sy = y + sin(a * angle * 0.92 + rotate) * radius * 0.9;
    } else {
      sx = x + (cos(a * angle + rotate) * radius) / 1.2;
      sy = y + (sin(a * angle + rotate) * radius) / 1.2;
    }
    vertex(sx, sy);
  }
  let sx = x + (cos(3 * angle + PI / 2 + rotate) * radius) / 2;
  let sy = y + (sin(3 * angle + PI / 2 + rotate) * radius) / 2;
  vertex(sx, sy);
  endShape(CLOSE);
}

function createCSlider(a, b, c, d) {
  r = new CSlider(a, b, c, d);
  return r;
}

class CSlider {
  constructor(min, max, value = (min + max) / 2, step = 1) {
    this.width = 130;
    this.height = 20;
    let widthtoheight = this.width - this.height;
    this.ratio = this.width / widthtoheight;
    this.x = 10;
    this.y = -1000;
    this.spos = this.x + this.width / 2 - this.height / 2;
    this.newspos = this.spos;
    this.sposMin = this.x;
    this.sposMax = this.x + this.width - this.height;
    this.vmin = min;
    this.vmax = max;
    this.svalue = constrain(value, this.vmin, this.vmax);
    this.vstep = step;
    this.loose = 1;
    this.over = false;
    this.locked = false;
    this.scale = 1;
  }

  update() {
    if (this.overEvent()) {
      this.over = true;
    } else {
      this.over = false;
    }
    if (mouseIsPressed && this.over) {
      this.locked = true;
    }
    if (!mouseIsPressed) {
      this.locked = false;
    }
    if (this.locked) {
      this.newspos = constrain(
        mouseX / this.scale - this.height / 2,
        this.sposMin,
        this.sposMax
      );
      this.svalue =
        this.vmin +
        (this.vmax - this.vmin) *
          ((this.newspos - this.sposMin) / (this.sposMax - this.sposMin));
      if (this.vstep > 0) {
        this.svalue =
          this.vmin +
          round((this.svalue - this.vmin) / this.vstep) * this.vstep;
      }
      this.newspos =
        this.x +
        (this.width - this.height) *
          ((this.svalue - this.vmin) / (this.vmax - this.vmin));
    }
    if (abs(this.newspos - this.spos) > 1) {
      this.spos = this.spos + (this.newspos - this.spos) / this.loose;
    }
  }

  overEvent() {
    if (
      mouseX / this.scale > this.x &&
      mouseX / this.scale < this.x + this.width &&
      mouseY / this.scale > this.y &&
      mouseY / this.scale < this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  display() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
    if (this.over || this.locked) {
      fill(0, 0, 0);
    } else {
      fill(102, 102, 102);
    }
    rect(this.spos, this.y, this.height, this.height);
  }

  getPos() {
    // Convert spos to be values between
    // 0 and the total width of the scrollbar
    return this.spos * this.ratio;
  }

  value() {
    return this.svalue;
  }

  setScale(sc) {
    this.scale = sc;
  }

  position(xp, yp) {
    this.x = xp;
    this.y = yp;
    if (this.vstep > 0) {
      this.svalue =
        this.vmin + round((this.svalue - this.vmin) / this.vstep) * this.vstep;
    }
    this.spos =
      this.x +
      (this.width - this.height) *
        ((this.svalue - this.vmin) / (this.vmax - this.vmin));
    //console.log(this.smin);
    this.newspos = this.spos;
    this.sposMin = this.x;
    this.sposMax = this.x + this.width - this.height;
    push();
    this.update();
    this.display();
    pop();
  }
}
