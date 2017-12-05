/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);



const express = __webpack_require__(0)
const bodyParser = __webpack_require__(1)
const http = __webpack_require__(2)
const socketio = __webpack_require__(15)
const path = __webpack_require__(3)
const ql = __webpack_require__(16)
const port = process.env.PORT || 3000

let app = express()
let server = http.Server(app)
let io = socketio(server)

app.use(bodyParser.urlencoded({extended: true}))
app.use('/libs', express.static(path.join(__dirname, '../../../libs')))
app.use('/dist', express.static(path.join(__dirname, '../../../dist')))

app.get('/', (req, res, next) => {
  res.send(__webpack_require__(17))
})

io.on('connection', (socket) => {
  let settings
  let isBlocked = false
  let lastFood = null

  socket.on('init', (clientSettings) => {
    settings = clientSettings
    __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].init(settings)
  })

  socket.on('tick', () => {
    let state
    let food
    if (!isBlocked) {
      isBlocked = true

      __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].update()

      state = __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */].state
      food = (lastFood && Object(__WEBPACK_IMPORTED_MODULE_1_lodash__["isEqual"])(state.food, lastFood)) ? false : state.food
      socket.emit('tick', {bots: state.bots, food: food})

      lastFood = state.food
      isBlocked = false
    }
  })
})

server.on('listening', () => console.log(`Listening on ::${port}`))
server.listen(port)

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src/qlearning/server"))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__food__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bot__ = __webpack_require__(11);



let settings = null

class Game {
  init (clientSettings) {
    settings = clientSettings
    this.food = []
    this.bots = []
    this.iterations = 0
    this.highestFitness = 0

    for (let i = 0; i < settings.food.amount; i++) {
      this.food.push(new __WEBPACK_IMPORTED_MODULE_0__food__["a" /* default */](settings))
    }

    for (let j = 0; j < settings.bots; j++) {
      let bot = new __WEBPACK_IMPORTED_MODULE_1__bot__["a" /* default */](j, settings)
      bot.init()
      this.bots.push(bot)
    }
  }

  get state () {
    return {
      food: this.food.map(f => {
        return {x: f.x, y: f.y, area: f.area}
      }),
      bots: this.bots.map(b => {
        return {index: b.index, x: b.x, y: b.y, area: b.area}
      }),
      me: null
    }
  }

  update () {
    for (let bot of this.bots) {
      try {
        let currentState = this.state
        currentState.me = {index: bot.index, x: bot.x, y: bot.y, area: bot.area}
        bot.update(currentState)
      } catch (e) {
        console.error(e)
        process.exit(0)
      }
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (new Game());


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let settings = null

class Food {
  constructor (clientSettings) {
    settings = clientSettings
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
    this.area = settings.food.area
  }

  reset () {
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
  }

  update () {}
}

/* harmony default export */ __webpack_exports__["a"] = (Food);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_qlearning__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_qlearning___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_qlearning__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(19);





const actions = [
  /* {key: 'nothing', move: {x: 0, y: 0}}, */
  {key: 'move-north', move: {x: 0, y: 1}},
  {key: 'move-south', move: {x: 0, y: -1}},
  {key: 'move-east', move: {x: 1, y: 0}},
  {key: 'move-west', move: {x: -1, y: 0}},
  {key: 'move-north-east', move: {x: 1, y: 1}},
  {key: 'move-north-west', move: {x: -1, y: 1}},
  {key: 'move-south-east', move: {x: 1, y: -1}},
  {key: 'move-south-west', move: {x: -1, y: -1}}
]
let settings = null

class Bot {
  constructor (index, clientSettings) {
    settings = clientSettings
    this.index = index
    this.hasStarted = false
    this.x = Math.floor(Math.random() * settings.width)
    this.y = Math.floor(Math.random() * settings.height)
    this.area = settings.area.min
  }

  init () {
    this.agent = new __WEBPACK_IMPORTED_MODULE_2_qlearning___default.a(`player-agent-${this.index}`, actions, 0.35)
      .setCost((state, action) => {
        return Bot.calculateReward(state, action)
      })
      .setReward(state => {
        return Bot.calculateReward(state)
      })
      .setStateGenerator((fromState, givenAction) => {
        let state = Bot.generateState(fromState, givenAction)
        this.x = state.me.x
        this.y = state.me.y
        this.area = state.me.area
        return state
      }).bind(this)

    this.agent.verbose = false
  }

  update (state) {
    if (!this.hasStarted) {
      this.agent.start(state)
      this.hasStarted = true
    }

    this.agent
      .perceiveState()
      .step()
      .perceiveState()
      .learn()
  }

  static generateState (fromState, givenAction) {
    // console.log(`Given ${givenAction.key}, what state is produced?`)
    let toState = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.clone(fromState)
    toState.me.x += givenAction.move.x
    toState.me.y += givenAction.move.y

    toState.me.x = toState.me.x > settings.width ? settings.width : toState.me.x < 0 ? toState.me.x = 0 : toState.me.x
    toState.me.y = toState.me.y > settings.height ? settings.height : toState.me.y < 0 ? toState.me.y = 0 : toState.me.y

    let nx = toState.me.x + givenAction.move.x
    let ny = toState.me.y + givenAction.move.y

    toState.me.area = toState.me.area * settings.size.decrease

    if (toState.me.area > settings.area.max) {
      toState.me.area = settings.area.max
    }

    if (toState.me.area < settings.area.min) {
      toState.me.area = settings.area.min
    }

    for (let food of __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].food) {
      let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* distance */])(nx, ny, food.x, food.y)
      let r1 = Math.sqrt(toState.me.area / Math.PI)
      let r2 = Math.sqrt(food.area / Math.PI)

      if (d < (r1 + r2) / 2 && toState.me.area > food.area * settings.size.relative) {
        toState.area += food.area
        food.reset()
      }
    }

    for (let bot of toState.bots) {
      if (bot.index === toState.me.index) continue
      let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* distance */])(nx, ny, bot.x, bot.y)
      let r1 = Math.sqrt(toState.me.area / Math.PI)
      let r2 = Math.sqrt(bot.area / Math.PI)

      // We have consumed another bot
      if (d < (r1 + r2) / 2 && toState.me.area > bot.area * settings.size.relative) {
        toState.area += bot.area
        toState.bots = toState.bots.filter(b => b.index !== bot.index)
        __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].bots = __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */].bots.filter(b => b.index !== bot.index)
      }
    }
    return toState
  }

  static calculateReward (state, action = false) {
    // console.log(`What's the reward of ${action.key}?`)
    let x = action ? state.me.x + action.move.x : state.me.x
    let y = action ? state.me.y + action.move.y : state.me.y
    let reward = settings.reward.tick

    for (let food of state.food) {
      let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* distance */])(x, y, food.x, food.y)
      let r1 = Math.sqrt(state.me.area / Math.PI)
      let r2 = Math.sqrt(food.area / Math.PI)

      if (d < ((r1 + r2) / 2) + settings.vision.food && state.me.area > food.area * settings.size.relative) {
        reward += settings.reward.eatFood
      }
    }

    for (let bot of state.bots) {
      if (bot.index === this.index) continue
      let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* distance */])(x, y, bot.x, bot.y)
      let r1 = Math.sqrt(state.me.area / Math.PI)
      let r2 = Math.sqrt(bot.area / Math.PI)

      if (d < ((r1 + r2) / 2) + settings.vision.player) {
        if (state.me.area > bot.area * settings.size.relative) {
          reward += settings.reward.consumePlayer
        } else {
          reward += settings.reward.die
        }
      }
    }
    return reward
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Bot);


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("qlearning");

/***/ }),
/* 14 */,
/* 15 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("q-exp");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<html>\n<head>\n    <title>Q-Learning agar.io Learning</title>\n    <style>\n        html, body {\n            padding: 0;\n            margin: 0;\n        }\n\n        #status {\n            background: rgba(0, 0, 0, 0.6);\n            padding: 15px;\n            color: #fefefe;\n            font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n            text-transform: uppercase;\n        }\n\n        #status > p {\n            display: inline-block;\n            margin: 5px 15px;\n        }\n\n        #chart-container {\n            position: relative;\n            height: 250px;\n            padding-top: 10px;\n        }\n\n        #chart {\n            height: auto !important;\n        }\n\n        #download {\n            position: absolute;\n            top: -100%;\n            left: -100%;\n        }\n    </style>\n    <script src=\"/libs/jquery-3.2.1.min.js\"></script>\n    <script src=\"/libs/neataptic.js\"></script>\n    <script src=\"/libs/p5.min.js\"></script>\n    <script src=\"/libs/chart.min.js\"></script>\n</head>\n<body>\n\n<script src=\"/dist/qlearning.bundle.js\"></script>\n</body>\n</html>";

/***/ }),
/* 18 */,
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const activationColor = (value, max) => {
  let power = 1 - Math.min(value / max, 1)
  let color = [255, 255, 0]

  if (power < 0.5) {
    color[0] = 2 * power * 255
  } else {
    color[1] = (1.0 - 2 * (power - 0.5)) * 255
  }

  return color
}
/* unused harmony export activationColor */


const angleToPoint = (x1, y1, x2, y2) => {
  let d = distance(x1, y1, x2, y2)
  let dx = (x2 - x1) / d
  let dy = (y2 - y1) / d

  let a = Math.acos(dx)
  return dy < 0 ? 2 * Math.PI - a : a
}
/* unused harmony export angleToPoint */


const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
/* harmony export (immutable) */ __webpack_exports__["a"] = distance;



/***/ })
/******/ ]);
//# sourceMappingURL=qlearning-server.bundle.js.map