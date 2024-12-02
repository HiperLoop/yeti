# Gomoku solver

## What is this?
I am creating solvers for the game Gomoku using 3 different techniques:
- Proof-Number search
- Dependency-Based search
- Artificial Intelligence

## How to play?
There are two options of how to play against my bots:
1. the code can be downloaded and run locally
2. I have a [website](https://smnd.sk/yeti/gomoku) where you can also play

## File structure
### Web elements
- **gomoku.html** is the web code that alows you to see and play the game
- **look.css** is the graphics for the web
### Game elemnts
- **game.js** is recreation of the game Gomoku
- **canvas.js** is drawing the game in the web browser
- **bot.js** was the last solver version (surrently not working)
- **PN_search.js** is where the proof-number search will be
- **PN_tree** contains proof-number tree elements
- **main.js** is the bundling root* that requires all the other files to run on the website
- **bundle.js** is the bundled version* of all the javascript together

\* I am using [Browserify](https://github.com/browserify/browserify) to bundle the .js modules together.