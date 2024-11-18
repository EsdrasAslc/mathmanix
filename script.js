const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const equationElement = document.getElementById('equation');
const scoreElement = document.getElementById('score');
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

let bossimage = new Image();
bossimage.src = 'alienBoss.png'

let alienstage2 = new Image();
alienstage2.src = 'alienstage2.png'

let alienstage3 = new Image();
alienstage3.src = 'alienstage3.png'


let nave = {
    x: (canvas.width / 2) - 80, // Centraliza a nave horizontalmente
    y: canvas.height - 90, // Posição inicial no eixo Y
    width: 140, // Largura do sprite
    height: 120, // Altura do sprite
};
let aliens = [];
let boss = []
let lasers = [];
let score = 0;
let isGameOver = false;
let rankings = [];
let lives = 3; // Total de vidas do jogador
let currentStage = 1;
let isBossActive = false;

function startGame() {
    aliens = [];
    lasers = [];
    score = 0;
    lives = 3;
    isGameOver = false;
    isBossActive = false;
    gameOverElement.style.display = 'none';
    answerInput.value = '';
    generateAliens();
    updateGame();
}

function generateAliens() {
    for (let i = 0; i < 2; i++) {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        const equation = `${a} + ${b}`;
        const result = a + b;

        aliens.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 80, // Largura do sprite
            height: 60, // Altura do sprite
            equation: equation,
            result: result,
            speed: 0.03 + Math.random() * 1,
            image: alienImage // Adiciona a imagem do alien
        });
    }
}
function generateAliensstage2() {
    for (let i = 0; i < 2; i++) {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        const equation = `${a} - ${b}`;
        const result = a - b;

        aliens.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 80, // Largura do sprite
            height: 60, // Altura do sprite
            equation: equation,
            result: result,
            speed: 0.5 + Math.random() * 1,
            image: alienstage2 // Adiciona a imagem do alien
        });
    }
}
function generateAliensstage3() {
    for (let i = 0; i < 2; i++) {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        let pot
        if (b < 5) {
            pot = 2;
        } else {
            pot = 3
        }
        const equation = `${a} ^ ${pot}`;
        const result = a ** pot;

        aliens.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 80, // Largura do sprite
            height: 60, // Altura do sprite
            equation: equation,
            result: result,
            speed: 0.1 + Math.random() * 1,
            image:alienstage3 // Adiciona a imagem do alien
        });
    }
}
function spawnBoss() {
    const equacoes = [
        {
            conta: '-50+20*3-10',
            display: '-50 + 20 * 3 - 10'
        },
        {
            conta: '80-25**2+5',
            display: '80 - 25² + 5'
        },
        {
            conta: '(-15)**2-7',
            display: '(-15)² - 7'
        },
        {
            conta: '-40*8+5**2',
            display: '-40 * 8 + 5²'
        },
        {
            conta: '50-12**2+(-9)',
            display: '50 - 12² + (-9)'
        },
        {
            conta: '-60+18*(-4)-6',
            display: '-60 + 18 * (-4) - 6'
        },
        {
            conta: '90+(-22)**2-15',
            display: '90 +(-22)² - 15'
        },
        {
            conta: '-70*9+6**2',
            display: '-70 * 9 + 6²'
        },
        {
            conta: '35-12**2+(-8)',
            display: '35 - 12² + (-8)'
        },
        {
            conta: '-25+10*(-5)+3**2',
            display: '-25 + 10 * (-5) + 3²'
        },
        {
            conta: '-45+(6**2)*(-3)-10',
            display: '-45 + 6² * (-3) - 10'
        }
    ]

    const numeroAleatorio = (Math.random() * 10).toFixed()


    aliens = []; // Limpa outros aliens
    isBossActive = true;
    console.log(equacoes[numeroAleatorio].display)
    console.log(eval(equacoes[numeroAleatorio].conta))
    aliens.push({
        x: canvas.width / 2 - 80,
        y: 0,
        width: 360,
        height: 320,
        equation: equacoes[numeroAleatorio].display, // Equação mais difícil
        result: eval(equacoes[numeroAleatorio].conta),
        speed: 0.15,
        image: bossimage,
        isBoss: true,
    });
}

function drawAliens() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar a nave usando o sprite
    ctx.drawImage(naveImage, nave.x, nave.y, nave.width, nave.height);

    // Desenhar os aliens usando o sprite
    aliens.forEach(alien => {
        ctx.drawImage(alien.image, alien.x, alien.y, alien.width, alien.height);
        
        // Configurações de estilo do texto
        ctx.fillStyle = '#000'; // Cor do texto
        ctx.font = 'bold 14px Arial'; // Tamanho e espessura da fonte

        // Calcular a largura e altura do texto
        const textWidth = ctx.measureText(alien.equation).width;
        const textHeight = 10; // Altura do texto original

        // Definir padding e comprimento extra (ajuste os valores)
        const padding = 5; // Largura extra em torno do texto
        const extraLength = 5; // Comprimento extra para o fundo
        const rectWidth = textWidth + padding + extraLength; // Largura total do retângulo
        const rectHeight = textHeight + 10; // Aumenta a altura do fundo

        // Posição do retângulo
        const rectX = alien.x + (alien.width - rectWidth) / 2; // Centralizar horizontalmente
        const rectY = alien.y + alien.height - rectHeight - 5; // Posicionar acima da parte inferior do alien

        // Desenhar fundo branco do tamanho da equação
        ctx.fillStyle = '#fff'; // Cor do fundo
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight); // Usar rectWidth e rectHeight

        // Desenhar borda
        ctx.strokeStyle = '#000'; // Cor da borda (preto)
        ctx.lineWidth = 2; // Espessura da borda
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight); // Usar rectWidth e rectHeight

        // Desenhar a equação
        ctx.fillStyle = '#000'; // Cor do texto (preto)
        ctx.fillText(alien.equation, rectX + padding / 2, rectY + textHeight + 5); // Posição do texto com um pouco de padding
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
        const targetAlien = laser.target;
        const dx = targetAlien.x + targetAlien.width / 2 - laser.x;
        const dy = targetAlien.y + targetAlien.height / 2 - laser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 100; // Aumentar a velocidade do laser

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

            // Gerar novo alien dependendo do estágio
            if (currentStage === 1) {
                generateAliens();  // Gera aliens da fase 1
            } else if (currentStage === 2) {
                generateAliensstage2();  // Gera aliens da fase 2
            } else if (currentStage === 3) {
                generateAliensstage3();  // Gera aliens da fase 3
            }
        }

        // Remover laser se ele sair da tela
        if (laser.y < 0) {
            lasers.splice(laserIndex, 1);
        }
    });
}

function updateLasersstage2() {
    lasers.forEach((laser, laserIndex) => {
        const targetAlien = laser.target;
        const dx = targetAlien.x + targetAlien.width / 2 - laser.x;
        const dy = targetAlien.y + targetAlien.height / 2 - laser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 100;

        laser.x += (dx / distance) * speed;
        laser.y += (dy / distance) * speed;

        // Verificar colisão de retângulo entre laser e alien
        if (
            laser.x < targetAlien.x + targetAlien.width &&
            laser.x + laser.width > targetAlien.x &&
            laser.y < targetAlien.y + targetAlien.height &&
            laser.y + laser.height > targetAlien.y
        ) {
            aliens.splice(aliens.indexOf(targetAlien), 1);
            lasers.splice(laserIndex, 1);
            score += 20;
            scoreElement.textContent = score;

            // Gerar novo alien da fase 2
            generateAliensstage2();  // Gera aliens da fase 2
        }

        if (laser.y < 0) {
            lasers.splice(laserIndex, 1);
        }
    });
}

function updateLasersstage3() {
    lasers.forEach((laser, laserIndex) => {
        const targetAlien = laser.target;
        const dx = targetAlien.x + targetAlien.width / 2 - laser.x;
        const dy = targetAlien.y + targetAlien.height / 2 - laser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 100;

        laser.x += (dx / distance) * speed;
        laser.y += (dy / distance) * speed;

        if (
            laser.x < targetAlien.x + targetAlien.width &&
            laser.x + laser.width > targetAlien.x &&
            laser.y < targetAlien.y + targetAlien.height &&
            laser.y + laser.height > targetAlien.y
        ) {
            aliens.splice(aliens.indexOf(targetAlien), 1);
            lasers.splice(laserIndex, 1);
            score += 10;
            scoreElement.textContent = score;

            // Gerar novo alien da fase 3
            generateAliensstage3();  // Gera aliens da fase 3
        }

        if (laser.y < 0) {
            lasers.splice(laserIndex, 1);
        }
    });
}
function updateLasersboss() {
    lasers.forEach((laser, laserIndex) => {
        // Calcular a direção do laser em relação ao alien
        const targetboss = laser.target;
        const dx = targetboss.x + targetboss.width / 2 - laser.x;
        const dy = targetboss.y + targetboss.height / 2 - laser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 100; // Aumentar a velocidade do laser

        // Movimento do laser em direção ao alien
        laser.x += (dx / distance) * speed;
        laser.y += (dy / distance) * speed;

        // Verificar colisão de retângulo entre laser e alien
        if (
            laser.x < targetboss.x + targetboss.width &&
            laser.x + laser.width > targetboss.x &&
            laser.y < targetboss.y + targetboss.height &&
            laser.y + laser.height > targetboss.y
        ) {
            // Remover alien e laser
            boss.splice(boss.indexOf(targetboss), 1);
            lasers.splice(laserIndex, 1);
            score += 10;
            scoreElement.textContent = score;
            generateAliens(); // Gerar novo alien
        }
// Remover laser se ele sair da tela
        if (laser.y < 0) {
            lasers.splice(laserIndex, 1);
        }
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

        // Verificar se o alien chegou ao final da tela (game over)
        if (alien.y + alien.height >= canvas.height) {
            endGame();
        }
    });

    if (currentStage === 2) {
        updatestage2();
    } else if (currentStage === 3) {
        updatestage3();
    } else {
        checkStage();
    }

    requestAnimationFrame(updateGame);
}

function updatestage2() {
    if (currentStage !== 2) return;

    drawAliens();
    drawLasers();
    updateLasersstage2();

    

    if (!isBossActive) checkStage();
    requestAnimationFrame(updatestage2);
}

function updatestage3() {
    if (currentStage !== 3) return;

    drawAliens();
    drawLasers();
    updateLasersstage3(); // Corrigir a chamada da função aqui

   
    if (!isBossActive) checkStage();
    requestAnimationFrame(updatestage3);
}

// Função de verificação do estágio
function checkStage() {
    // Verifica pontuação e estágio atual para evitar múltiplas chamadas
    if (score >= 500 && currentStage === 2) {
        aliens = [];
        currentStage = 3;
        generateAliensstage3();
    } else if (score >= 200 && currentStage === 1) {
        aliens = [];
        currentStage = 2;
        generateAliensstage2();
    } else if (score >= 800 && !isBossActive && currentStage === 3) {
        spawnBoss();
    }
}

function gerarNewAlien() {
    const num = Math.random() * 10;

    if (aliens.length > 5) {
        return 0
    }
    console.log("OK")
    if (score < 200) {
        generateAliens();
    } else if (score >= 200 && score < 500) {
        if (num < 5) {
            generateAliensstage2();
        } else {
            generateAliens();
        }
    } else if (score >= 500 && score < 800) {
        if (num < 5) {
            if (num < 2.5) {
                generateAliensstage2();
            } else {
                generateAliens();
            }
        } else {
            generateAliensstage3();
        }
    } else if (score === 800) {
        spawnBoss();
    }
    
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

function endGame() {
    isGameOver = true;
    finalScoreElement.textContent = score;
    saveRanking();
    displayRanking();
    gameOverElement.style.display = 'block';
    // Não reiniciar essas variáveis aqui; deixe isso para `startGame()`
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
