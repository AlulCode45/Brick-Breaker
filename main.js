const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const score = document.getElementById('score')
const health = document.getElementById('health')

canvas.width = canvas.scrollWidth
canvas.height = canvas.scrollHeight

const bricks = []
const brickGap = 3
const brickWidth = 100 - 27
const bricksHeight = 50
const bricksRows = 250
let scorePoint = 0
let healthPlay = 3


class Brick {
    constructor(x, y, randomColor) {
        this.x = x
        this.y = y
        this.width = brickWidth
        this.height = bricksHeight
        this.colorsList = ['red', 'blue', 'green']
        this.randomColor = randomColor
        this.health = (randomColor == 0) ? 3 : randomColor == 1 ? 2 : randomColor == 2 ? 1 : 0
    }
    draw() {
        ctx.fillStyle = this.colorsList[this.randomColor]
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

function createBricks() {
    for (let y = 0; y < bricksRows; y += bricksHeight + brickGap) {
        for (let x = 0; x < canvas.width; x += brickWidth + brickGap) {
            let randomColor = Math.floor(Math.random() * 3)
            bricks.push(new Brick(x, y, randomColor))
        }
    }
}
createBricks()
function handleBricks() {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        brick.draw()
    }
}
class Ball {
    constructor() {
        this.width = 15
        this.height = 15
        this.x = canvas.width / 2 - this.width / 2
        this.y = 300
        this.firstSpeed = 3  // Reduce the speed for better visibility
        this.speedX = this.firstSpeed
        this.speedY = this.firstSpeed
    }

    draw() {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2)
        ctx.fill()
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off the left wall
        if (this.x < 0) {
            this.speedX = this.firstSpeed;
        }
        // Bounce off the right wall
        if (this.x + this.width > canvas.width) {
            this.speedX = -this.firstSpeed;
        }

        // Bounce off the top wall (optional)
        if (this.y < 0) {
            this.speedY = this.firstSpeed;
        }
    }
}


class Player {
    constructor() {
        this.width = 200
        this.height = 20
        this.x = canvas.width / 2 - this.width / 2
        this.y = canvas.height - this.height
        this.speed = 7
    }
    draw() {
        ctx.fillStyle = 'yellow'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    update() {
        window.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 37:
                    if (this.x > 0)
                        this.x -= this.speed
                    break;
                case 39:
                    if (this.x < canvas.width - this.width)
                        this.x += this.speed
                    break;
            }
        })
    }
}

const player = new Player()
const ball = new Ball()
player.update()

function handleGame() {
    if (collision(ball, player)) {
        ball.speedY = -ball.firstSpeed
        ball.speedX = ball.speedX
    }


    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        if (collision(ball, brick)) {
            ball.speedY = ball.firstSpeed
            ball.speedX = -ball.firstSpeed
            brick.health -= 1
            if (brick.health <= 0) {
                scorePoint += 5
                bricks.splice(i, 1)
            }
        }
    }

    if (ball.y > canvas.height + ball.height) {
        cancelAnimationFrame(animate)
        scorePoint = 0
    }
}

function collision(first, second) {
    if (!(
        first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y
    )) {
        return true
    }
}

function handleGameInfo() {
    score.innerHTML = 'Score : ' + scorePoint
    health.innerHTML = 'Health : ' + healthPlay
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleGameInfo()
    handleBricks()
    player.draw()
    ball.update()
    ball.draw()

    handleGame()

    requestAnimationFrame(animate)
}

animate()