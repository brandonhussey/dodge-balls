var para = document.querySelector("p");
var count;

// setup canvas

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var width = (canvas.width = window.innerWidth);
var height = (canvas.height = window.innerHeight);

var easy = document.querySelector("#easy");
var normal = document.querySelector("#norm");
var hard = document.querySelector("#hard");

var h1 = document.querySelector("h1");

// function to generate random number

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

//ball constructor

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

/* This draws the ball, colours it
 * creates arc with x/y coords, radius (aka size),
 * and start and end degrees (aka 0, 2*PI)
 */

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

/*
 * x and y are the centre of the ball, add/subtract the size to find the edge
 * checking if greater or or less than edge of screen (width/0, and height/0)
 * this.velX = -(this.velX) is saying when edge is reached, reverse
 */

Ball.prototype.update = function () {
  //too far right, reverse
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  //too far left, reverse
  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  //too far up, reverse
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  //too far down, reverse
  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  /*
   * add the velocity to the coord
   * each time method called, ball coord are x + velX or y + velY
   */

  this.x += this.velX;
  this.y += this.velY;
};

//check is every other ball has contacted the burrent ball

Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    //check to ensure we're no checking to see if a ball collided with itself
    //i.e dont check the current ball
    if (!(this === balls[j])) {
      //checking for circle area overlap
      //look up 2d collision detection
      //check the coords of the ball against all others
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        // balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        this.velX = -this.velX;
        this.velY = -this.velY;
      }
    }
  }
};

//player circle constructor

function Player(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);

  this.color = "black";
  this.size = 10;
}

//set prototype
Player.prototype = Object.create(Shape.prototype);
Player.prototype.constructor = Player;

//draw player circle
Player.prototype.draw = function () {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

//check bounds of player Player
Player.prototype.checkBounds = function () {
  //too far right, reverse
  if (this.x + this.size >= width) {
    this.x -= this.size;
  }

  //too far left, reverse
  if (this.x - this.size <= 0) {
    this.x += this.size;
  }

  //too far up, reverse
  if (this.y + this.size >= height) {
    this.y -= this.size;
  }

  //too far down, reverse
  if (this.y - this.size <= 0) {
    this.y += this.size;
  }
};

Player.prototype.setControls = function () {
  var _this = this;
  window.onkeydown = function (e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  };
  window.addEventListener("mousemove", function (e) {
    _this.x = e.pageX;
    _this.y = e.pageY;
  });
};

Player.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        //count--;
        //para.textContent = 'Ball count: ' + count;
        //this.size += balls[j].size;
        alert("game over! Score: " + count);
        document.location.reload();
      }
    }
  }
};

// creates random balls and store all the ball objects

var balls = [];

function startGame(x, y) {
  while (balls.length < x) {
    var size = random(10, 20);
    var ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-y, y),
      random(-y, y),
      true,
      "rgb(" +
        random(0, 255) +
        "," +
        random(0, 255) +
        "," +
        random(0, 255) +
        ")",
      size
    );

    balls.push(ball);
    //count++;
    //para.textContent = 'Ball count: ' + count;
  }
}

var startBalls = [];

while (startBalls.length < 50) {
  var size = random(20, 50);
  var ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-3, 3),
    random(-3, 3),
    true,
    "rgba(" +
      random(0, 255) +
      "," +
      random(0, 255) +
      "," +
      random(0, 255) +
      ", 0.5)",
    size
  );
  startBalls.push(ball);
}

function StartScreen() {
  ctx.clearRect(0, 0, width, height);
  for (var i = 0; i < startBalls.length; i++) {
    if (startBalls[i].exists) {
      startBalls[i].draw();
      startBalls[i].update();
    }
  }

  requestAnimationFrame(StartScreen);
}

var player = new Player(random(0, width), random(0, height), true);
player.setControls();

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, width, height);

  //while there are balls in the array, draw then update to reposition balls on canvas (move them)
  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  player.draw();
  player.checkBounds();
  player.collisionDetect();

  //makes a nice smooth animation, is recursive
  requestAnimationFrame(loop);
}

easy.addEventListener("click", function () {
  easy.style.display = "none";
  normal.style.display = "none";
  hard.style.display = "none";
  canvas.style.cursor = "none";
  h1.style = "text-shadow: 0 0 4px white; top: -4px; right: 5px";

  count = setInterval(function () {
    count++;
    para.textContent = "Score: " + count;
  }, 1000);

  for (var i = 0; i < startBalls.length; i++) {
    startBalls[i].exists = false;
  }

  startGame(15, 5);

  loop();
});

normal.addEventListener("click", function () {
  easy.style.display = "none";
  normal.style.display = "none";
  hard.style.display = "none";
  canvas.style.cursor = "none";
  h1.style = "text-shadow: 0 0 4px white; top: -4px; right: 5px";

  count = setInterval(function () {
    count++;
    para.textContent = "Score: " + count;
  }, 1000);

  for (var i = 0; i < startBalls.length; i++) {
    startBalls[i].exists = false;
  }

  startGame(25, 7);

  loop();
});

hard.addEventListener("click", function () {
  easy.style.display = "none";
  normal.style.display = "none";
  hard.style.display = "none";
  canvas.style.cursor = "none";
  h1.style = "text-shadow: 0 0 4px black; top: -4px; right: 5px";

  count = setInterval(function () {
    count++;
    para.textContent = "Score: " + count;
  }, 1000);

  for (var i = 0; i < startBalls.length; i++) {
    startBalls[i].exists = false;
  }

  startGame(25, 10);

  loop();
});

StartScreen();
//loop();
