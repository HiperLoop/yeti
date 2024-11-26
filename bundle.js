(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function isHigh(windowSize) {
    return windowSize[1] > windowSize[0] ? true : false;
}

function maxSize(windowSize) {
    return isHigh(windowSize) ? windowSize[0] - 10 : windowSize[1] - 10;
}

function resizeCanvas(windowSize, canvas) {
    const setSize = maxSize(windowSize);
    canvas.width = setSize;
    canvas.height = setSize;
}

function drawGrid(gridSize, windowSize, canvas) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = "#DCB35C";
    const size = maxSize(windowSize);
    ctx.fillRect(0, 0, size, size);

    for(let i = 0; i < gridSize; ++i) {
        const rectSize = canvas.height/gridSize;
        const start = 0.5 * rectSize;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(start-1 + i*rectSize, start-1);
        ctx.lineTo(start-1 + i*rectSize, canvas.height - start);
        ctx.moveTo(start-1, start-1 + i*rectSize);
        ctx.lineTo(canvas.height - start, start-1 + i*rectSize);
        ctx.stroke();
        ctx.closePath();
    }
}

function resize_canvas(windowSize, canvas, gridSize, board) {
    resizeCanvas(windowSize, canvas);
    drawGrid(gridSize, windowSize, canvas);
    drawBoard(board, gridSize);
}

function drawMove(i, j, player, gridSize) {
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");

    ctx.beginPath();
    const rectSize = c.height/gridSize;

    ctx.fillStyle = "#000000";
    if(player == -1) {ctx.fillStyle = "#ffffff";}

    ctx.moveTo(j * rectSize + (rectSize/4 * 3), i * rectSize + (rectSize/2));
    ctx.arc(j * rectSize + (rectSize/2), i * rectSize + (rectSize/2), rectSize/4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawBoard(board, gridSize) {
    for(let i = 0; i < gridSize; ++i) {
        for(let j = 0; j < gridSize; ++j) {
            if(board[i][j] != 0) {
                drawMove(i, j, board[i][j], gridSize);
            }
        }
    }
}

function drawWin(start, end, gridSize) {
    console.log(start + " - " + end);
    const c = document.getElementById("myCanvas");
    const ctx = c.getContext("2d");
    const rectSize = c.height/gridSize;

    ctx.beginPath();
    ctx.moveTo(start[1]*rectSize + rectSize/2, start[0]*rectSize + rectSize/2);
    ctx.lineTo(end[1]*rectSize + rectSize/2, end[0]*rectSize + rectSize/2);
    ctx.lineWidth = 10;
    ctx.stroke();
}

module.exports = {resize_canvas, resizeCanvas, isHigh, maxSize, drawGrid, drawMove, drawWin};
},{}],2:[function(require,module,exports){
const {isHigh, maxSize, drawMove, drawGrid, drawWin} = require('./canvas.js');
//const {compressBoard} = require('./compression.js');
//const {makeBotMove} = require('./bot.js');

let moveCounter = 0;
const gridSize = 15;
const winLength = 5;
const board = new Array(gridSize * gridSize);
let gameOver = false;
let botFirst = false;
const bot = -1;
const human = 1;
let humanVhuman = true;

function createBoard() {
    for(let i = 0; i < gridSize; ++i) {
        board[i] = [];
        for(let j = 0; j < gridSize; ++j) {
            board[i][j] = 0;
        }
    }
}

function resetGame(windowSize, canvas) {
    moveCounter = 0;
    botFirst = !botFirst;
    gameOver = false;
    createBoard();
    drawGrid(gridSize, windowSize, canvas);
}

function checkWin(x, y) {
    let chain = new Array(2);
    const player = board[x][y];
    chain = [[], [], [player]];
    let chainLength = 0;
    let newChain = true;

    //horizontal
    for(let i = Math.max(y-(winLength-1), 0); i <= Math.min(y+(winLength-1), (gridSize-1)); ++i){
        if(board[x][i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [x, i];
                newChain = false;
            }
            else {chain[1] = [x, i];}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {return chain;}
    }
    //vertical
    chainLength = 0;
    newChain = true;
    for(let i = Math.max(x-(winLength-1), 0); i <= Math.min(x+(winLength-1), (gridSize-1)); ++i){
        if(board[i][y] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [i, y];
                newChain = false;
            }
            else {chain[1] = [i, y];}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {return chain;}
    }
    //diagonal
    chainLength = 0;
    newChain = true;
    let bottomOffset = Math.min(x-Math.max(x-(winLength-1), 0),y-Math.max(y-(winLength-1), 0));
    let topOffset = Math.min(Math.min(x+(winLength-1), (gridSize-1))-x, Math.min(y+(winLength-1), (gridSize-1))-y);
    for(let i = -bottomOffset; i <= topOffset; ++i){
        if(board[x+i][y+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [x+i, y+i];
                newChain = false;
            }
            else {chain[1] = [x+i, y+i];}
        }
        else{chainLength = 0; newChain = true}
        if(chainLength == winLength) {return chain;}
    }

    chainLength = 0;
    newChain = true;
    bottomOffset = Math.min(Math.min(x+(winLength-1), (gridSize-1))-x,y-Math.max(y-(winLength-1), 0));
    topOffset = Math.min(x-Math.max(x-(winLength-1), 0), Math.min(y+(winLength-1), (gridSize-1))-y);
    for(let i = -bottomOffset; i <= topOffset; ++i){
        if(board[x-i][y+i] == player) {
            ++chainLength;
            if(newChain) {
                chain[0] = [x-i, y+i];
                newChain = false;
            }
            else {chain[1] = [x-i, y+i];}
        }
        else{chainLength = 0; newChain = true;}
        if(chainLength == winLength) {return chain;}
    }
    return [[0], [0], [0]];
}

function checkGameEnd(x, y) {
    const won = checkWin(x, y);
    if(won[2] != 0) {
        gameOver = true;
        console.log(won + " won")
        drawWin(won[0], won[1], gridSize);
    }
    if(moveCounter >= gridSize * gridSize) {gameOver = true;}
}

function getCoordsFromEvent(event, windowSize) {
    const xPos = event.clientX;
    const yPos = event.clientY;
    const mSize = maxSize(windowSize);
    const width = windowSize[0];
    const height = windowSize[1];
    var yCoord = Math.floor((xPos-((width-mSize)/2))/(mSize/gridSize));
    var xCoord = Math.floor((yPos-5)/(mSize/gridSize));
    if(isHigh(windowSize)) {
        yCoord = Math.floor((xPos-5)/(mSize/gridSize));
        xCoord = Math.floor((yPos-((height-mSize)/2))/(mSize/gridSize));
    }

    return [xCoord, yCoord];
}

function makePlayerMove(x, y, player) {
    board[x][y] = player;
    drawMove(x, y, player, gridSize);
    ++moveCounter;
}

function tryMove(event, windowSize) {
    const coords = getCoordsFromEvent(event, windowSize);
    console.log(coords);
    if(board[coords[0]][coords[1]] == 0) {
        //console.log(botFirst);
        makePlayerMove(coords[0], coords[1], humanVhuman ? (botFirst ? (moveCounter % 2 == 0 ? bot : human) : (moveCounter % 2 == 0 ? human : bot)) : human);
        checkGameEnd(coords[0], coords[1]);
    }
}

function gameLoop(event, windowSize, canvas) {
    if(!gameOver) {
        tryMove(event, windowSize);

        /*const botMove = makeBotMove(bot, gridSize);
        makePlayerMove(botMove[0], botMove[1], bot);
        checkGameEnd(botMove[0], botMove[1]);*/
    }
    else{
        resetGame(windowSize, canvas);

        if(botFirst) {
            /*const botMove = makeBotMove(bot, gridSize);
            makePlayerMove(botMove[0], botMove[1], bot);
            checkGameEnd(botMove[0], botMove[1]);*/
        }
    }
}

module.exports = {gridSize, winLength, board, tryMove, createBoard, gameLoop, checkWin};
},{"./canvas.js":1}],3:[function(require,module,exports){
const { create } = require('domain');
const {resize_canvas} = require('./canvas.js');
const {gameLoop, gridSize, createBoard, board} = require('./game.js');

//website variables
let cnv;

//when window is loaded
window.onload = function() {
    createBoard();

    cnv = document.getElementById("myCanvas");
    cnv.addEventListener("mouseup", (event) => {gameLoop(event, [window.innerWidth, window.innerHeight], cnv);});
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
}

window.onresize = function() {
    resize_canvas([window.innerWidth, window.innerHeight], cnv, gridSize, board);
}
},{"./canvas.js":1,"./game.js":2,"domain":4}],4:[function(require,module,exports){
// This file should be ES5 compatible
/* eslint prefer-spread:0, no-var:0, prefer-reflect:0, no-magic-numbers:0 */
'use strict'

module.exports = (function () {
	// Import Events
	var events = require('events')

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function () {
		var d = new events.EventEmitter()

		function emitError (e) {
			d.emit('error', e)
		}

		d.add = function (emitter) {
			emitter.on('error', emitError)
		}
		d.remove = function (emitter) {
			emitter.removeListener('error', emitError)
		}
		d.bind = function (fn) {
			return function () {
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err) {
					emitError(err)
				}
			}
		}
		d.intercept = function (fn) {
			return function (err) {
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err) {
						emitError(err)
					}
				}
			}
		}
		d.run = function (fn) {
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		}
		d.dispose = function () {
			this.removeAllListeners()
			return this
		}
		d.enter = d.exit = function () {
			return this
		}
		return d
	}
	return domain
}).call(this)

},{"events":5}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}]},{},[3]);
