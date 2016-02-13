// Var canvas and context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Canvas resize
// window.addEventListener('resize', resizeCanvas, false);
// function resizeCanvas() {
//      canvas.style.width =	'50vw';
//      canvas.style.height=	'50vh';
//      canvas.width  = canvas.offsetWidth;
//      canvas.height = canvas.offsetHeight;
// }
// resizeCanvas();

// Rest of variables
var r;
var c;
var x = canvas.width / 2;
var y = canvas.height - 30;
var speed = 4;
var dx = speed;
var dy = -speed;
var ballRadius = 10;
var color = "#0095DD";
var score = 0;
var lives = 3;
// Paddle var
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
//Buttons var
var rightPressed = false;
var leftPressed = false;
//Bricks variables
var brickRowCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
// Brick col count to improve
var brickColumnCount = 5; /*(canvas.width-brickOffsetLeft*2)/(brickWidth+brickPadding)-1;*/

// Creating bricks
var bricks = [];
for (c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r += 1) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
// Drawing bricks
function drawBricks() {
    for (c = 0; c < brickColumnCount; c += 1) {
        for (r = 0; r < brickRowCount; r += 1) {
            if (bricks[c][r].status === 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


// Random color picker function
function getRandomColor() {
    var letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    var color = '#';
    for (i = 0; i < 6; i += 1 ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//Ball drawing function
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
//Paddle drawing function
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}




//One function to rule them all
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;
	if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
	    dx = -dx;
	    color = getRandomColor();
	}
	if(y + dy < ballRadius) {
    	dy = -dy;
    	color = getRandomColor();
	} else if(y + dy > canvas.height-ballRadius) {
	    if(x > paddleX && x < paddleX + paddleWidth) {
	        dy = -dy;
	  		dx += 0.5;
			dy += -0.5;
	    }
	    else {
	        lives--;
			if(!lives) {
				//Improve
			    alert("GAME OVER");
			    document.location.reload();
			}
			else {
			    x = canvas.width/2;
			    y = canvas.height-30;
			    dx = speed;
			    dy = -speed;
			    paddleX = (canvas.width-paddleWidth)/2;
			}
	    }
	}
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
	}
	else if(leftPressed && paddleX > 0) {
	    paddleX -= 7;
	}
	requestAnimationFrame(draw);
}
// Key event
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
// Mouse move event
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

//Collision detector
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                    	// Improve
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Score drawing
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
// Lives drawing
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


// Call draw function
draw();