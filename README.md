# Gomoku solver

## What is this?
I am creating solvers for the game Gomoku using 3 different techniques:
- Proof Number search
- Dependency Based search
- Artificial Intelligence

## How to play?
There are two options of how to play against my bots:
1. the code can be downloaded and run locally
2. I have a [website](smnd.sk/yeti/gomoku) where you can also play

## File structure
- **game.js** is recreation of the game Gomoku
- **canvas.js** is drawing the game in the web browser
- **gomoku.html** is the web code that alows you to see and play the game
- **bot.js** is the current solver (more will come)
- **alfabeta.js** is a solver using the minimax algorithm (this will be removed shortly)
- **main.js** is the bundling root* that requires all the other files to run on the website

\* I am using [Browserify](https://github.com/browserify/browserify) to bundle the .js modules together.