const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const equationElement = document.getElementById('equation');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const answerInput = document.getElementById('answerInput');
const submitAnswerButton = document.getElementById('submitAnswer');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const rankingList = document.getElementById('rankingList');
const restartButton = document.getElementById('restartButton');
const livesElement = document.getElementById('lives');

let naveImage = new Image();
naveImage.src = 'spritenave(1).png'; // Caminho para a imagem do sprite da nave
let alienImage = new Image();
alienImage.src = 'alien.png';
let alienBossImage = new Image();
alienBossImage.src = 'alienBoss.png'; // Imagem do chefe

let nave = {
    x: (canvas.width / 2) - 80,
    y: canvas.height - 90,
    width: 140,
    height: 120,
};
let aliens = [];
let lasers = [];
let score = 0;
let gameTimer = 60;
let isGameOver = false;
let rankings = [];
let lives = 3; // Total de vidas do jogador
let currentStage = 1;
let isBossActive = false;

function startGame() {
    aliens = [];
    lasers = [];
    score = 0;
    gameTimer = 180;
    lives = 3;
    currentStage = 1;
    isGameOver = false;
    isBossActive = false;
    gameOverElement.style.display = 'none';
    answerInput.value = '';
    updateLivesDisplay();
    generateAliens();
    updateGame();
    startTimer();
}

function generateAliens() {
    for (let i = 0; i < 3 + currentStage; i++) {
        const a = Math.floor(Math.random() * (10 + currentStage * 5));
        const b = Math.floor(Math.random() * (10 + currentStage * 5));
        const equation = `${a} + ${b}`;
        const result = a + b;

        aliens.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 80,
            height: 60,
            equation: equation,
            result: result,
            speed: 0.1 + Math.random() * currentStage,
            image: alienImage,
        });
    }
}

function spawnBoss() {
    aliens = []; // Limpa outros aliens
    isBossActive = true;

    aliens.push({
        x: canvas.width / 2 - 80,
        y: 0,
        width: 160,
        height: 120,
        equation: '40 + 60', // Equação mais difícil
        result: 100,
        speed: 0.2,
        image: alienBossImage,
        isBoss: true,
    });
}

function drawAliens() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(naveImage, nave.x, nave.y, nave.width, nave.height);

    aliens.forEach(alien => {
        ctx.drawImage(alien.image, alien.x, alien.y, alien.width, alien.height);

        ctx.fillStyle = '#000';
        ctx.font = 'bold 14px Arial';
        const textWidth = ctx.measureText(alien.equation).width;
        const textHeight = 10;
        const padding = 5;
        const extraLength = 5;
        const rectWidth = textWidth + padding + extraLength;
        const rectHeight = textHeight + 10;
        const rectX = alien.x + (alien.width - rectWidth) / 2;
        const rectY = alien.y + alien.height - rectHeight - 5;

        ctx.fillStyle = '#fff';
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
        ctx.fillStyle = '#000';
        ctx.fillText(alien.equation, rectX + padding / 2, rectY + textHeight + 5);
    });
}

function updateLivesDisplay() {
    livesElement.innerHTML = ''; // Limpa o display de vidas
    for (let i = 0; i < 3; i++) {
        const life = document.createElement('span');
        life.textContent = '⬤';
        life.style.color = i < lives ? 'black' : 'white';
        livesElement.appendChild(life);
    }
}

function loseLife() {
    lives--;
    updateLivesDisplay();
    if (lives <= 0) endGame();
}

function updateGame() {
    if (isGameOver) return;

    drawAliens();
    drawLasers();
    updateLasers();

    aliens.forEach(alien => {
        alien.y += alien.speed;

        if (alien.y + alien.height >= canvas.height) {
            loseLife();
            aliens.splice(aliens.indexOf(alien), 1);
        }
    });

    if (!isBossActive) checkStage();
    requestAnimationFrame(updateGame);
}

function checkStage() {
    if (score >= 400 && !isBossActive) {
        spawnBoss();
    } else if (score >= 240 && currentStage < 3) {
        currentStage = 3;
        generateAliens();
    } else if (score >= 120 && currentStage < 2) {
        currentStage = 2;
        generateAliens();
    }
}

function checkAnswer() {
    const answer = parseInt(answerInput.value);
    if (!isNaN(answer)) {
        let validAliens = aliens.filter(alien => alien.result === answer);
        if (validAliens.length > 0) {
            let closestAlien = validAliens.reduce((prev, current) => {
                return (prev.y > current.y) ? prev : current;
            });
            lasers.push({
                x: nave.x + nave.width / 2 - 2.5,
                y: nave.y,
                width: 5,
                height: 20,
                target: closestAlien,
            });
            answerInput.value = '';
        } else {
            aliens.forEach(alien => alien.speed += 0.5);
        }
        answerInput.value = '';
    }
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(timerInterval);
            return;
        }
        gameTimer--;
        timerElement.textContent = gameTimer;
        if (gameTimer <= 0) endGame();
    }, 1000);
}

function endGame() {
    isGameOver = true;
    finalScoreElement.textContent = score;
    saveRanking();
    displayRanking();
    gameOverElement.style.display = 'block';
    isBossActive = false;
    currentStage = 1;
    lives = 3;
}

function saveRanking() {
    const playerName = prompt("Digite seu nome:");
    rankings.push({ name: playerName, score: score });
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 5);
}

function displayRanking() {
    rankingList.innerHTML = '';
    rankings.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${player.name}: ${player.score}`;
        rankingList.appendChild(listItem);
    });
}

submitAnswerButton.addEventListener('click', checkAnswer);
restartButton.addEventListener('click', startGame);
answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

startGame();
