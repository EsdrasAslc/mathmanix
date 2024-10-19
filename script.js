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

let nave = {  x: (canvas.width / 2) - 25, // Centraliza a nave horizontalmente
    y: canvas.height - 35, // Posição inicial no eixo Y
    width: 50, // Largura do sprite
    height: 30, // Altura do sprite};
}
let aliens = [];
let lasers = [];
let score = 0;
let gameTimer = 60;
let isGameOver = false;
let rankings = [];

function startGame() {
    aliens = [];
    lasers = [];
    score = 0;
    gameTimer = 180;
    isGameOver = false;
    gameOverElement.style.display = 'none';
    answerInput.value = '';
    generateAliens();
    updateGame();
    startTimer();
}

function generateAliens() {
    for (let i = 0; i < 3; i++) {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        const equation = `${a} + ${b}`;
        const result = a + b;

        aliens.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 40,
            height: 30,
            equation: equation,
            result: result,
            speed: 0.1 + Math.random() * 1
        });
    }
}
function generatenewAliens() {
    for (let i = 0; i < 2; i++) {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        const equation = `${a} + ${b}`;
        const result = a + b;

        aliens.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 40,
            height: 30,
            equation: equation,
            result: result,
            speed: 0.2 + Math.random() * 1
        });
    }
}


function drawAliens() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar nave
    ctx.fillStyle = '#00f';
    ctx.fillRect(nave.x, nave.y, nave.width, nave.height);

    // Desenhar aliens
    aliens.forEach(alien => {
        ctx.fillStyle = '#f00';
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        ctx.fillStyle = '#fff';
        ctx.fillText(alien.equation, alien.x + 5, alien.y + 20);
    });
}

function drawLasers() {
    // Desenhar lasers
    lasers.forEach(laser => {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });
}

function updateLasers() {
    lasers.forEach((laser, laserIndex) => {
        // Calcular a direção do laser em relação ao alien
        const targetAlien = laser.target;
        const dx = targetAlien.x + targetAlien.width / 2 - laser.x;
        const dy = targetAlien.y + targetAlien.height / 2 - laser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 40; // Aumentar a velocidade do laser

        // Movimento do laser em direção ao alien
        laser.x += (dx / distance) * speed;
        laser.y += (dy / distance) * speed;

        // Verificar colisão de retângulo entre laser e alien
        if (
            laser.x < targetAlien.x + targetAlien.width &&
            laser.x + laser.width > targetAlien.x &&
            laser.y < targetAlien.y + targetAlien.height &&
            laser.y + laser.height > targetAlien.y
        ) {
            // Remover alien e laser
            aliens.splice(aliens.indexOf(targetAlien), 1);
            lasers.splice(laserIndex, 1);
            score += 10;
            scoreElement.textContent = score;
            generatenewAliens(); // Gerar novo alien
        }

        // Remover laser se ele sair da tela
        if (laser.y < 0) {
            lasers.splice(laserIndex, 1);
        }
    });
}

function updateGame() {
    if (isGameOver) return;

    drawAliens();
    drawLasers();
    updateLasers();

    aliens.forEach(alien => {
        alien.y += alien.speed;

        // Verificar se o alien chegou ao final da tela (game over)
        if (alien.y + alien.height >= canvas.height) {
            endGame();
        }
    });

    requestAnimationFrame(updateGame);
}

function checkAnswer() {
    const answer = parseInt(answerInput.value);
    if (!isNaN(answer)) {
        // Verificar quais aliens têm a resposta correta
        let validAliens = aliens.filter(alien => alien.result === answer);

        if (validAliens.length > 0) {
            // Encontrar o alien mais próximo (com menor valor de 'y')
            let closestAlien = validAliens.reduce((prev, current) => {
                return (prev.y > current.y) ? prev : current;
            });

            // Criar um laser que irá em direção ao alien mais próximo com a resposta correta
            lasers.push({
                x: nave.x + nave.width / 2 - 2.5,  // Largura do laser centralizada na nave
                y: nave.y,
                width: 5,
                height: 20,
                target: closestAlien // Associar o laser ao alien mais próximo
            });

            answerInput.value = '';
        } else {
            // Se errar, aumentar a velocidade dos aliens
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
        if (gameTimer <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isGameOver = true;
    finalScoreElement.textContent = score;
    saveRanking();
    displayRanking();
    gameOverElement.style.display = 'block';
}

function saveRanking() {
    const playerName = prompt("Digite seu nome:");
    rankings.push({ name: playerName, score: score });
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 5); // Apenas os top 5
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
// Capturar o evento de pressionar "Enter" no campo de input
answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();  // Chama a função que verifica a resposta
    }
});


// Iniciar o jogo
startGame();
