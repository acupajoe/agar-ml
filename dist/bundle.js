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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

let width = window.innerWidth
let height = 600

module.exports = {
  width: width,
  height: height,
  area: {
    min: 7500,
    max: 30000
  },
  size: {
    relative: 1.1,
    decrease: 0.998
  },
  detection: {
    food: 3,
    player: 3,
    radius: 250
  },
  speed: {
    min: 0.3,
    normal: 2
  },
  food: {
    area: 750,
    amount: Math.round(width * height * 4e-4)
  },
  bots: 15,
  iterations: 750,
  maxGenerations: 1000,
  startingHiddenSize: 2,
  mutationRate: 0.275,
  elitismPercent: 0.15,
  shouldShowDetection: false,
  isTrainedPop: false
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bot__ = __webpack_require__(3);


const settings = __webpack_require__(0)

const Neat = neataptic.Neat
const Methods = neataptic.Methods
const Network = neataptic.Network
const Architect = neataptic.Architect

class Trainer {
  constructor () {
    this.neat = new Neat(
      1 + settings.detection.player * 3 + settings.detection.food * 2,
      2,
      null,
      {
        mutation: [
          Methods.Mutation.ADD_NODE,
          Methods.Mutation.SUB_NODE,
          Methods.Mutation.ADD_CONN,
          Methods.Mutation.SUB_CONN,
          Methods.Mutation.MOD_WEIGHT,
          Methods.Mutation.MOD_BIAS,
          Methods.Mutation.MOD_ACTIVATION,
          Methods.Mutation.ADD_GATE,
          Methods.Mutation.SUB_GATE,
          Methods.Mutation.ADD_SELF_CONN,
          Methods.Mutation.ADD_BACK_CONN,
          Methods.Mutation.SUB_BACK_CONN
        ],
        popsize: settings.bots,
        mutationRate: settings.mutationRate,
        elitism: Math.round(settings.elitismPercent * settings.bots),
        network: new Architect.Random(
          1 + settings.detection.player * 3 + settings.detection.food * 2,
          settings.startingHiddenSize,
          2
        )
      })
    if (settings.isTrainedPop) {
      let population = []
      const saved = __webpack_require__(6)
      for (let i = 0; i < settings.bots; i++) {
        let json = saved[i % saved.length]
        population.push(Network.fromJSON(json))
      }
      this.neat.population = population
    }
  }

  start () {
    window.Game.bots = []
    for (let genome of this.neat.population) {
      window.Game.bots.push(new __WEBPACK_IMPORTED_MODULE_0__bot__["a" /* default */](genome))
    }
    document.getElementById('generation').innerText = this.neat.generation.toString()
  }

  end () {
    let newPopulation = []

    console.log(`Generation: ${this.neat.generation}, Avg Score: ${this.neat.getAverage()}`)

    document.getElementById('average-fitness').innerText = Math.floor(this.neat.getAverage())

    window.Chart.data.labels.push(`Gen. ${this.neat.generation + 1}`)
    window.Chart.data.datasets[0].data.push({x: this.neat.generation + 1, y: this.neat.getAverage()})
    window.Chart.update()

    this.neat.sort()

    for (let i = 0; i < this.neat.elitism; i++) {
      newPopulation.push(this.neat.population[i])
    }

    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newPopulation.push(this.neat.getOffspring())
    }

    $.post('http://localhost:3000/store', {
      generation: this.neat.generation + 1,
      data: JSON.stringify(newPopulation)
    })

    this.neat.population = newPopulation
    this.neat.mutate()
    this.neat.generation++

    if (this.neat.generation < settings.maxGenerations) {
      this.start()
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (new Trainer());


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__trainer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(4);



const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
    xAxes: [{
      display: false
    }],
    yAxes: [{
      display: false,
      ticks: {
        beginAtZero: true
      }
    }]
  }
}

window.setup = function () {
  let chart = document.getElementById('chart')
  let context = chart.getContext('2d')

  window.Chart = new Chart(context, {
    type: 'line',
    data: {
      labels: ['Gen. 0'],
      datasets: [{
        label: 'Average Fitness',
        data: [{x: 0, y: 0}],
        backgroundColor: 'rgba(33,150,243, 0.4)'
      }]
    },
    options: chartOptions
  })

  window.Game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */]()
  window.Trainer = __WEBPACK_IMPORTED_MODULE_0__trainer__["a" /* default */]
  window.Trainer.start()
}

window.draw = function () {
  clear()
  window.Game.update()
  window.Game.draw()
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__settings__);


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

const angleToPoint = (x1, y1, x2, y2) => {
  let d = distance(x1, y1, x2, y2)
  let dx = (x2 - x1) / d
  let dy = (y2 - y1) / d

  let a = Math.acos(dx)
  return dy < 0 ? 2 * Math.PI - a : a
}

const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

class Bot {
  constructor (genome) {
    this.x = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width)
    this.y = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)
    this.vx = 0 // velocity x
    this.vy = 0 // velocity y

    this.cognition = genome
    this.cognition.score = 0
    this.area = __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.min
    this.visualArea = this.area
    this.aggro = this.area
    this.detected = []
  }

  update () {
    if (this.area > __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.max) this.area = __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.max
    if (this.area < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.min) this.area = __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.min

    let input = this.detect()
    let output = this.cognition.activate(input)

    let movementAngle = output[0] * 2 * Math.PI
    let movementSpeed = output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1]

    this.vx = movementSpeed * Math.cos(movementAngle) * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.speed.normal
    this.vy = movementSpeed * Math.sin(movementAngle) * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.speed.normal

    // Speed should be affected by size (larger = more cumbersome)
    this.vx *= Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_0__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.speed.normal)
    this.vy += Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_0__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.speed.normal)

    this.x += this.vx
    this.y += this.vy

    // Force bot to stay in bounds
    this.x = this.x >= __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width ? __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width : this.x <= 0 ? 0 : this.x
    this.y = this.y >= __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height ? __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height : this.y <= 0 ? 0 : this.y

    this.area *= __WEBPACK_IMPORTED_MODULE_0__settings___default.a.size.decrease

    this.cognition.score = this.area

    // Do we do better?
    if (this.cognition.score > window.Game.highestFitness) {
      window.Game.highestFitness = this.cognition.score
      document.getElementById('highest-fitness').innerText = Math.floor(this.cognition.score)
    }
  }

  draw () {
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = activationColor(this.cognition.score, window.Game.highestFitness)

    fill(color)
    ellipse(this.x, this.y, radius)

    if (__WEBPACK_IMPORTED_MODULE_0__settings___default.a.shouldShowDetection || distance(mouseX, mouseY, this.x, this.y) < Math.sqrt(this.visualArea / Math.PI)) {
      this.showDetection()
    }
  }

  reset () {
    this.x = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width)
    this.y = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)
    this.vx = 0
    this.vy = 0
    this.area = __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.min
    this.visualArea = this.area
  }

  eat (obj) {
    let d = distance(this.x, this.y, obj.x, obj.y)
    let r1 = Math.sqrt(this.area / Math.PI)
    let r2 = Math.sqrt(obj.area / Math.PI)

    if (d < (r1 + r2) / 2 && this.area > obj.area * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.size.relative) {
      this.area += obj.area
      obj.reset()
      return true
    }
    return false
  }

  detect () {
    let output = [this.area / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.max]

    let nearestFood = []
    let distanceToFood = Array.apply(null, Array(__WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.food)).map(Number.prototype.valueOf, Infinity)

    let nearestPlayers = []
    let distanceToPlayers = Array.apply(null, Array(__WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.player)).map(Number.prototype.valueOf, Infinity)

    for (let player of window.Game.bots) {
      if (player === this || this.eat(player)) continue

      let d = distance(this.x, this.y, player.x, player.y)
      if (d < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.radius) {
        let maxNearestDistance = Math.max.apply(null, distanceToPlayers)
        let i = distanceToPlayers.indexOf(maxNearestDistance)

        if (d < maxNearestDistance) {
          distanceToPlayers[i] = d
          nearestPlayers[i] = player
        }
      }
    }

    for (let food of window.Game.food) {
      if (this.eat(food)) continue

      let d = distance(this.x, this.y, food.x, food.y)
      if (d < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.radius) {
        let maxNearestDistance = Math.max.apply(null, distanceToFood)
        let i = distanceToFood.indexOf(maxNearestDistance)

        if (d < maxNearestDistance) {
          distanceToFood[i] = d
          nearestFood[i] = food
        }
      }
    }

    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.player; i++) {
      let player = nearestPlayers[i]
      let d = distanceToPlayers[i]

      if (player === undefined) {
        output = output.concat([0, 0, 0])
      } else {
        output.push(angleToPoint(this.x, this.y, player.x, player.y) / (2 * Math.PI))
        output.push(d / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.radius)
        output.push(player.area / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.area.max)
      }
    }

    for (let j = 0; j < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.food; j++) {
      let food = nearestFood[j]
      let d = distanceToFood[j]

      if (food === undefined) {
        output = output.concat([0, 0])
      } else {
        output.push(angleToPoint(this.x, this.y, food.x, food.y) / (2 * Math.PI))
        output.push(d / __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.radius)
      }
    }

    this.detected = nearestPlayers.concat(nearestFood)
    return output
  }

  showDetection () {
    noFill()
    for (let obj of this.detected) {
      if (obj !== undefined) {
        stroke(obj instanceof Bot ? 'red' : 'lightgreen')
        line(this.x, this.y, obj.x, obj.y)
      }
    }

    let color = activationColor(this.cognition.score, window.Game.highestFitness)
    stroke(color)
    ellipse(this.x, this.y, __WEBPACK_IMPORTED_MODULE_0__settings___default.a.detection.radius * 2)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bot;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__settings__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trainer__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food__ = __webpack_require__(5);




class Game {
  constructor () {
    this.food = []
    this.bots = []
    this.iterations = 0
    this.highestFitness = 0

    createCanvas(__WEBPACK_IMPORTED_MODULE_0__settings___default.a.width, __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)

    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.food.amount; i++) {
      this.food.push(new __WEBPACK_IMPORTED_MODULE_2__food__["a" /* default */]())
    }

    if (!__WEBPACK_IMPORTED_MODULE_0__settings___default.a.isTrainedPop) {
      for (let j = 0; j < 15; j++) {
        __WEBPACK_IMPORTED_MODULE_1__trainer__["a" /* default */].neat.mutate()
      }
    }
  }

  update () {
    if (this.iterations === __WEBPACK_IMPORTED_MODULE_0__settings___default.a.iterations) {
      __WEBPACK_IMPORTED_MODULE_1__trainer__["a" /* default */].end()
      this.iterations = 0
    }

    for (let bot of this.bots) {
      bot.update()
    }
  }

  draw () {
    background(255)
    this.drawGrid()
    this.drawFood()
    this.drawBots()

    this.iterations++
    document.getElementById('iteration').innerText = `${this.iterations} / ${__WEBPACK_IMPORTED_MODULE_0__settings___default.a.iterations}`
  }

  drawGrid () {
    let spacing = 25
    stroke(204, 204, 204, 160)
    fill(255)

    for (let x = 0; x < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width / spacing; x++) {
      line(x * spacing, 0, x * spacing, __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)
    }

    for (let y = 0; y < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height / spacing; y++) {
      line(0, y * spacing, __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width, y * spacing)
    }

    noStroke()
  }

  drawFood () {
    for (let food of this.food) {
      food.draw()
    }
  }

  drawBots () {
    for (let bot of this.bots) {
      bot.draw()
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__settings__);


class Food {
  constructor () {
    this.x = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width)
    this.y = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)
    this.area = __WEBPACK_IMPORTED_MODULE_0__settings___default.a.food.area

    this.color = [124, 252, 0]
  }

  draw () {
    this.radius = Math.sqrt(this.area / Math.PI)

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    ellipse(this.x, this.y, this.radius)
  }

  reset () {
    this.x = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.width)
    this.y = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Food;



/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = [{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.028040773806276675,"from":10,"to":17,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"GAUSSIAN","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":-0.03144964195054745,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.4382690114422916,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.02518445070423203,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"SINUSOID","index":"17"}],"connections":[{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.0364289562250375,"from":0,"to":17,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":-0.03144964195054745,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.4382690114422916,"from":10,"to":16,"gater":null},{"weight":0.17559245186512876,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.02518445070423203,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.028040773806276675,"from":10,"to":17,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"GAUSSIAN","index":"16"},{"bias":1.3624612714425455,"type":"output","squash":"SINUSOID","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.4382690114422916,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.02518445070423203,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"SINUSOID","index":"17"}],"connections":[{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.0364289562250375,"from":0,"to":17,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.4382690114422916,"from":10,"to":16,"gater":null},{"weight":0.17559245186512876,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.02518445070423203,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":0.028040773806276675,"from":10,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"SINUSOID","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":-0.05431859412211848,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":0.028040773806276675,"from":10,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"GAUSSIAN","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":-0.03144964195054745,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.4382690114422916,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"HLIM","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"SINUSOID","index":"17"}],"connections":[{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":-0.017424951504871306,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":0.17559245186512876,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.02518445070423203,"from":11,"to":17,"gater":null},{"weight":-0.05431859412211848,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null},{"weight":0.0364289562250375,"from":0,"to":17,"gater":null},{"weight":-0.03144964195054745,"from":6,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.028040773806276675,"from":10,"to":17,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2},{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":-0.9531009809631262,"type":"output","squash":"TANH","index":"16"},{"bias":0.7701959743243645,"type":"output","squash":"HLIM","index":"17"}],"connections":[{"weight":0.0364289562250375,"from":0,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":16,"gater":null},{"weight":0.046627445920683075,"from":1,"to":17,"gater":null},{"weight":0.05432423937170078,"from":3,"to":16,"gater":null},{"weight":0.01595463276420861,"from":2,"to":17,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":16,"gater":null},{"weight":0.05432423937170078,"from":3,"to":17,"gater":15},{"weight":-0.035046823093671395,"from":5,"to":16,"gater":null},{"weight":-0.04294551408179941,"from":4,"to":17,"gater":null},{"weight":0.07401215904867062,"from":6,"to":16,"gater":null},{"weight":-0.035046823093671395,"from":5,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":16,"gater":null},{"weight":0.024866538103826885,"from":6,"to":17,"gater":null},{"weight":0.9888532399437975,"from":7,"to":17,"gater":null},{"weight":0.17559245186512876,"from":9,"to":16,"gater":null},{"weight":-0.05957340513006031,"from":8,"to":17,"gater":null},{"weight":0.0012071060089633434,"from":10,"to":16,"gater":null},{"weight":-0.05819710655751962,"from":9,"to":17,"gater":null},{"weight":0.02518445070423203,"from":11,"to":16,"gater":null},{"weight":0.028040773806276675,"from":10,"to":17,"gater":null},{"weight":0.015863174018538387,"from":11,"to":17,"gater":null},{"weight":0.09893484573143652,"from":13,"to":16,"gater":null},{"weight":-0.02249867302093192,"from":12,"to":17,"gater":null},{"weight":0.048971516597419384,"from":14,"to":16,"gater":null},{"weight":0.09893484573143652,"from":13,"to":17,"gater":null},{"weight":0.17424292243131023,"from":15,"to":16,"gater":null},{"weight":0.7973415793744272,"from":14,"to":17,"gater":null},{"weight":0.9651646439930828,"from":17,"to":16,"gater":null}],"input":16,"output":2}]

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map