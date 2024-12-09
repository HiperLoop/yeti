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
### Public
This folder includes files that run during runtime:
#### Web elements
- **gomoku.html** is the web code that alows you to see and play the game
- **look.css** is the graphics for the web
#### Game elemnts
- **game.js** is recreation of the game Gomoku
- **canvas.js** is drawing the game in the web browser
- **bot.js** was the last solver version (surrently not working)
- **PN_search.js** is where the proof-number search will be
- **PN_tree.js** contains proof-number tree elements
-**DB-search.js** is the implementation of DB-search
- **main.js** is the root file that imports all the other files to run on the website

### Src
This folder includes source code that is later compiled to javascript to run:
- **tsconfig.json** is used to compile typescrpit files into javascript
- **.ts** files are the source code for the **.js** counterparts with the same name in *Public*