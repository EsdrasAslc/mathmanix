# 🚀 MathSpace: Gamificando a Matemática

[![Project Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)](#)

Um jogo interativo e lúdico desenvolvido como projeto prático para a disciplina de **Estrutura de Dados**, ministrada pelo **Professor Jean Trabuco**. O objetivo principal é transformar o aprendizado de equações matemáticas numa experiência divertida, estimulante e visual para crianças.

---

## 🎮 Sobre o Jogo

Em **Mathmanix**, o jogador controla uma nave defensora posicionada na base da tela. O universo está a ser invadido por Aliens, e cada um deles carrega consigo uma **equação matemática única**. 

* **A Ameaça:** Os Aliens surgem em posições aleatórias no topo e descem continuamente em direção à nave. Se um Alien alcançar a base, o jogador perde uma vida.
* **A Defesa:** Para destruir um Alien, o jogador deve digitar a resposta correta da equação no campo designado. 
* **O Tiro:** Ao acertar o cálculo, a nave dispara um laser que elimina o Alien correspondente.
* **A Punição por Erro:** Se o jogador errar a resposta, a velocidade de descida de *todos* os Aliens na tela aumenta imediatamente, elevando a dificuldade e punindo o descuido.

---

## 🛠️ Tecnologias e Conceitos de Estrutura de Dados

O projeto vai além da interface gráfica; ele serve como laboratório para a aplicação prática de estruturas de dados dinâmicas para o gerenciamento dos elementos em tela.

### Estruturas Utilizadas
* **Gerenciamento de Inimigos:** Utilização de estruturas lineares (como **Listas Encadeadas** ou **Filas**) para controlar o fluxo de surgimento, renderização e remoção dos Aliens ativos no ecrã.
* **Ordenação/Busca:** Algoritmos de busca para identificar instantaneamente qual Alien possui a equação correspondente à resposta digitada pelo utilizador.

---

## 🎯 Funcionalidades Principais

* [x] Geração aleatória de posições para os inimigos.
* [x] Atribuição dinâmica de equações matemáticas para cada Alien.
* [x] Sistema de colisão (Alien atinge a base = perda de vida).
* [x] Mecânica de input e validação de respostas em tempo real.
* [x] Efeito cascata de aceleração de velocidade ao cometer erros.
* [x] Disparo de laser com animação de destruição do alvo correto.

---

## 💻 Como Executar o Projeto

### Pré-requisitos
Antes de começar, vais precisar de ter instalado na tua máquina as seguintes ferramentas:
* [Listar aqui o que for necessário, ex: Git, Node.js, Python, C++, Raylib, etc.]

### Passo a Passo

```bash
# 1. Clona este repositório
$ git clone [https://github.com/EsdrasAslc/mathmanix.git](https://github.com/EsdrasAslc/mathmanix.git)

# 2. Acede à pasta do projeto
$ cd mathmanix

# 3. Instala as dependências (se houver)
$ [comando de instalação, ex: npm install ou pip install -r requirements.txt]

# 4. Executa o jogo
$ [comando para rodar, ex: npm start, ou compile o arquivo principal]
