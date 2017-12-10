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

let width = 1000
let height = 600

module.exports = {
  width: width,
  height: height,
  area: {
    min: 7500,
    max: 500000
  },
  size: {
    relative: 1.1,
    decrease: 0.9995
  },
  detection: {
    food: 3,
    player: 3,
    radius: 250
  },
  speed: {
    min: 0.5,
    normal: 2
  },
  food: {
    area: 750,
    amount: 650
  },
  bots: 5,
  randomBots: 0,
  iterations: 750,
  maxGenerations: 100,
  startingHiddenSize: 0,
  mutationRate: 0.3,
  elitismPercent: 0.1,
  shouldShowDetection: false,
  shouldUseSavedPositions: true,
  shouldRunClean: false,
  hasHumanControlledPlayer: true,
  isTrainedPop: false
}


/***/ }),
/* 1 */
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
/* harmony export (immutable) */ __webpack_exports__["a"] = activationColor;


const angleToPoint = (x1, y1, x2, y2) => {
  let d = distance(x1, y1, x2, y2)
  let dx = (x2 - x1) / d
  let dy = (y2 - y1) / d

  let a = Math.acos(dx)
  return dy < 0 ? 2 * Math.PI - a : a
}
/* harmony export (immutable) */ __webpack_exports__["b"] = angleToPoint;


const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
/* harmony export (immutable) */ __webpack_exports__["c"] = distance;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__settings__);



class Food extends __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */] {
  constructor (x, y) {
    super()
    this.x = x || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width)
    this.y = y || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height)
    this.area = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.food.area

    this.color = [124, 252, 0]
  }

  draw () {
    this.radius = Math.sqrt(this.area / Math.PI)

    fill(this.color[0], this.color[1], this.color[2])
    noStroke()
    ellipse(this.x, this.y, this.radius)
  }

  reset () {
    this.x = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width)
    this.y = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height)
  }

  update () {}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Food;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bot__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__randomizedBot__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__positions_json__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__positions_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__positions_json__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__player__ = __webpack_require__(15);





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
      const saved = __webpack_require__(10)
      for (let i = 0; i < settings.bots; i++) {
        let json = saved[i % saved.length]
        population.push(Network.fromJSON(json))
      }
      this.neat.population = population
    }
  }

  start () {
    window.Game.reset()
    window.Game.bots = []
    let cursor = 0

    // Create NEAT Bots
    if (settings.bots > 0) {
      for (let genome of this.neat.population) {
        if (settings.shouldUseSavedPositions) {
          let item = __WEBPACK_IMPORTED_MODULE_2__positions_json___default.a.bots[cursor % __WEBPACK_IMPORTED_MODULE_2__positions_json___default.a.bots.length]
          window.Game.bots.push(new __WEBPACK_IMPORTED_MODULE_0__bot__["a" /* default */](genome, item.x, item.y))
        } else {
          window.Game.bots.push(new __WEBPACK_IMPORTED_MODULE_0__bot__["a" /* default */](genome))
        }
        cursor++
      }
      // window.Game.print()
    }

    // Create Randomized Bots
    if (settings.randomBots > 0) {
      for (let i = 0; i < settings.randomBots; i++) {
        if (settings.shouldUseSavedPositions) {
          let item = __WEBPACK_IMPORTED_MODULE_2__positions_json___default.a.bots[cursor % __WEBPACK_IMPORTED_MODULE_2__positions_json___default.a.bots.length]
          window.Game.randomBots.push(new __WEBPACK_IMPORTED_MODULE_1__randomizedBot__["a" /* default */](item.x, item.y))
        } else {
          window.Game.randomBots.push(new __WEBPACK_IMPORTED_MODULE_1__randomizedBot__["a" /* default */]())
        }
        cursor++
      }
    }

    // Create Player instance
    if (settings.hasHumanControlledPlayer) {
      if (settings.shouldUseSavedPositions) {
        let item = __WEBPACK_IMPORTED_MODULE_2__positions_json___default.a.bots[cursor % __WEBPACK_IMPORTED_MODULE_2__positions_json___default.a.bots.length]
        window.Game.player = new __WEBPACK_IMPORTED_MODULE_3__player__["a" /* default */](item.x, item.y)
      } else {
        window.Game.player = new __WEBPACK_IMPORTED_MODULE_3__player__["a" /* default */]()
      }
    }

    document.getElementById('generation').innerText = this.neat.generation.toString()
  }

  end () {
    let newPopulation = []

    let randomBotsAvg = window.Game.randomBots.reduce((a, b) => a + b.score, 0) / window.Game.randomBots.length
    let average = settings.bots > 0 ? this.neat.getAverage() : randomBotsAvg

    console.log(`Generation: ${this.neat.generation}, Avg Score: ${average}`)

    window.Chart.data.labels.push(`Gen. ${this.neat.generation + 1}`)
    window.Chart.data.datasets[0].data.push({x: this.neat.generation + 1, y: average})
    window.Chart.update()

    document.getElementById('average-fitness').innerText = Math.floor(average)

    $.post('http://localhost:3000/store', {
      generation: this.neat.generation + 1,
      data: newPopulation ? JSON.stringify(newPopulation) : null,
      averageFitness: average,
      roundHighestFitness: window.Game.roundHighestFitness
    })

    if (settings.bots > 0) {
      this.neat.sort()

      for (let i = 0; i < this.neat.elitism; i++) {
        newPopulation.push(this.neat.population[i])
      }

      for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
        newPopulation.push(this.neat.getOffspring())
      }
      this.neat.population = newPopulation
      this.neat.mutate()
    }

    this.neat.generation++
    if (this.neat.generation < settings.maxGenerations) {
      this.start()
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (new Trainer());


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents anything appearing in the game
 */
class Entity {
  draw () {}
  update () {}
  reset () {}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Entity;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__food__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__settings__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(1);




let actions = [
  {x: 1, y: 1},
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: 0, y: -1},
  {x: -1, y: 0},
  {x: -1, y: -1}
]

class RandomizedBot {
  constructor (x, y) {
    this.x = x || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width)
    this.y = y || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height)
    this.area = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.min
    this.visualArea = this.area
    this.isDead = false
    this.score = 0
  }

  update () {
    if (this.isDead) {
      this.area = 0
      return
    }

    let action = actions[Math.floor(Math.random() * (actions.length))]
    let vx = action.x * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal
    let vy = action.y * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal

    // Speed should be affected by size (larger = more cumbersome)
    vx *= Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal)
    vy += Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal)

    this.x += vx
    this.y += vy

    window.Game.food.forEach(f => this.eat(f))
    window.Game.bots.forEach(b => this.eat(b))
    window.Game.randomBots.forEach(b => {
      if (b === this) return
      this.eat(b)
    })

    if (window.Game.player) {
      this.eat(window.Game.player)
    }

    this.area *= __WEBPACK_IMPORTED_MODULE_1__settings___default.a.size.decrease
    if (this.area > __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.max) this.area = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.max
    if (this.area < __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.min) this.area = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.min

    this.x = this.x >= __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width ? __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width : this.x <= 0 ? 0 : this.x
    this.y = this.y >= __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height ? __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height : this.y <= 0 ? 0 : this.y

    this.score = this.area
    if (this.score > window.Game.highestFitness) {
      window.Game.highestFitness = this.score
      document.getElementById('highest-fitness').innerText = Math.floor(this.score)
    }

    if (this.score > window.Game.roundHighestFitness) {
      window.Game.roundHighestFitness = this.score
    }
  }

  reset () {
    this.x = this._x || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width)
    this.y = this._y || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height)
    this.vx = 0
    this.vy = 0
    this.area = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.min
    this.visualArea = this.area
  }

  eat (obj) {
    let d = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* distance */])(this.x, this.y, obj.x, obj.y)
    let r1 = Math.sqrt(this.area / Math.PI)
    let r2 = Math.sqrt(obj.area / Math.PI)

    if (d < (r1 + r2) / 2 && this.area > obj.area * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.size.relative) {
      this.area += obj.area
      if (obj instanceof __WEBPACK_IMPORTED_MODULE_0__food__["a" /* default */]) {
        obj.reset()
      } else {
        obj.isDead = true
      }
      return true
    }
    return false
  }

  draw () {
    if (this.isDead) {
      return
    }
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* activationColor */])(this.score, window.Game.highestFitness)

    fill(color)
    ellipse(this.x, this.y, radius)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RandomizedBot;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {"food":[{"x":451,"y":230},{"x":980,"y":158},{"x":414,"y":235},{"x":619,"y":535},{"x":191,"y":536},{"x":317,"y":286},{"x":847,"y":311},{"x":393,"y":162},{"x":835,"y":114},{"x":482,"y":231},{"x":45,"y":575},{"x":939,"y":526},{"x":311,"y":512},{"x":938,"y":74},{"x":620,"y":488},{"x":34,"y":296},{"x":203,"y":399},{"x":613,"y":402},{"x":919,"y":556},{"x":809,"y":174},{"x":773,"y":96},{"x":491,"y":156},{"x":973,"y":329},{"x":294,"y":290},{"x":760,"y":131},{"x":502,"y":234},{"x":939,"y":285},{"x":589,"y":399},{"x":196,"y":288},{"x":372,"y":550},{"x":19,"y":215},{"x":238,"y":355},{"x":268,"y":206},{"x":257,"y":7},{"x":297,"y":563},{"x":191,"y":540},{"x":718,"y":165},{"x":554,"y":468},{"x":891,"y":546},{"x":412,"y":96},{"x":959,"y":106},{"x":304,"y":34},{"x":912,"y":177},{"x":200,"y":320},{"x":95,"y":447},{"x":976,"y":317},{"x":197,"y":11},{"x":958,"y":63},{"x":751,"y":429},{"x":913,"y":139},{"x":192,"y":262},{"x":408,"y":596},{"x":712,"y":209},{"x":920,"y":214},{"x":561,"y":381},{"x":83,"y":153},{"x":765,"y":344},{"x":867,"y":332},{"x":314,"y":122},{"x":183,"y":64},{"x":98,"y":335},{"x":95,"y":174},{"x":552,"y":139},{"x":123,"y":106},{"x":418,"y":63},{"x":45,"y":125},{"x":330,"y":427},{"x":568,"y":343},{"x":665,"y":375},{"x":843,"y":131},{"x":325,"y":502},{"x":507,"y":572},{"x":77,"y":230},{"x":889,"y":517},{"x":746,"y":73},{"x":342,"y":217},{"x":172,"y":199},{"x":137,"y":214},{"x":491,"y":78},{"x":953,"y":194},{"x":293,"y":234},{"x":80,"y":479},{"x":479,"y":442},{"x":73,"y":269},{"x":494,"y":190},{"x":30,"y":578},{"x":573,"y":398},{"x":777,"y":415},{"x":82,"y":117},{"x":78,"y":289},{"x":254,"y":343},{"x":370,"y":87},{"x":431,"y":113},{"x":785,"y":278},{"x":687,"y":178},{"x":211,"y":546},{"x":536,"y":231},{"x":400,"y":343},{"x":634,"y":308},{"x":540,"y":431},{"x":672,"y":241},{"x":287,"y":101},{"x":330,"y":222},{"x":747,"y":131},{"x":84,"y":251},{"x":505,"y":123},{"x":551,"y":512},{"x":707,"y":263},{"x":926,"y":282},{"x":110,"y":239},{"x":12,"y":414},{"x":926,"y":249},{"x":88,"y":315},{"x":721,"y":406},{"x":288,"y":433},{"x":827,"y":43},{"x":188,"y":364},{"x":334,"y":239},{"x":599,"y":319},{"x":275,"y":26},{"x":20,"y":554},{"x":616,"y":185},{"x":762,"y":253},{"x":857,"y":92},{"x":431,"y":495},{"x":144,"y":317},{"x":843,"y":533},{"x":383,"y":87},{"x":603,"y":248},{"x":639,"y":541},{"x":3,"y":381},{"x":680,"y":395},{"x":512,"y":317},{"x":485,"y":337},{"x":663,"y":122},{"x":750,"y":594},{"x":266,"y":347},{"x":529,"y":204},{"x":435,"y":403},{"x":494,"y":348},{"x":974,"y":15},{"x":47,"y":281},{"x":394,"y":412},{"x":788,"y":239},{"x":587,"y":10},{"x":616,"y":20},{"x":766,"y":456},{"x":307,"y":58},{"x":848,"y":454},{"x":61,"y":15},{"x":969,"y":427},{"x":285,"y":574},{"x":7,"y":89},{"x":255,"y":160},{"x":332,"y":390},{"x":883,"y":511},{"x":745,"y":424},{"x":260,"y":171},{"x":54,"y":359},{"x":239,"y":301},{"x":482,"y":555},{"x":50,"y":206},{"x":151,"y":410},{"x":31,"y":446},{"x":480,"y":416},{"x":780,"y":299},{"x":396,"y":570},{"x":280,"y":75},{"x":420,"y":587},{"x":190,"y":440},{"x":383,"y":236},{"x":958,"y":439},{"x":518,"y":586},{"x":706,"y":19},{"x":56,"y":149},{"x":162,"y":257},{"x":926,"y":594},{"x":402,"y":109},{"x":10,"y":68},{"x":845,"y":509},{"x":349,"y":157},{"x":225,"y":563},{"x":314,"y":181},{"x":832,"y":277},{"x":694,"y":440},{"x":493,"y":322},{"x":970,"y":3},{"x":97,"y":177},{"x":862,"y":273},{"x":341,"y":122},{"x":600,"y":186},{"x":800,"y":98},{"x":817,"y":350},{"x":207,"y":200},{"x":232,"y":546},{"x":514,"y":338},{"x":377,"y":69},{"x":321,"y":252},{"x":798,"y":243},{"x":478,"y":379},{"x":522,"y":586},{"x":60,"y":72},{"x":306,"y":553},{"x":649,"y":530},{"x":722,"y":360},{"x":109,"y":588},{"x":746,"y":42},{"x":158,"y":177},{"x":142,"y":250},{"x":846,"y":119},{"x":689,"y":494},{"x":578,"y":311},{"x":426,"y":80},{"x":262,"y":577},{"x":315,"y":301},{"x":107,"y":290},{"x":960,"y":14},{"x":13,"y":277},{"x":736,"y":525},{"x":261,"y":465},{"x":546,"y":369},{"x":973,"y":58},{"x":424,"y":567},{"x":172,"y":198},{"x":234,"y":489},{"x":197,"y":305},{"x":73,"y":91},{"x":307,"y":184},{"x":783,"y":236},{"x":155,"y":31},{"x":321,"y":248},{"x":776,"y":199},{"x":964,"y":393},{"x":221,"y":98},{"x":264,"y":301},{"x":686,"y":39},{"x":772,"y":137},{"x":388,"y":201},{"x":277,"y":230},{"x":126,"y":322},{"x":865,"y":15},{"x":263,"y":254},{"x":754,"y":224},{"x":785,"y":4},{"x":842,"y":375},{"x":835,"y":318},{"x":253,"y":216},{"x":203,"y":195},{"x":846,"y":170},{"x":59,"y":90},{"x":689,"y":107},{"x":878,"y":33},{"x":415,"y":454},{"x":608,"y":287},{"x":879,"y":539},{"x":392,"y":429},{"x":651,"y":367},{"x":102,"y":497},{"x":361,"y":348},{"x":89,"y":56},{"x":596,"y":159},{"x":460,"y":492},{"x":348,"y":92},{"x":554,"y":388},{"x":957,"y":299},{"x":925,"y":330},{"x":653,"y":90},{"x":553,"y":433},{"x":126,"y":406},{"x":42,"y":24},{"x":637,"y":445},{"x":122,"y":185},{"x":743,"y":303},{"x":210,"y":198},{"x":392,"y":430},{"x":494,"y":298},{"x":723,"y":137},{"x":686,"y":95},{"x":504,"y":545},{"x":159,"y":391},{"x":909,"y":62},{"x":856,"y":50},{"x":963,"y":483},{"x":623,"y":259},{"x":205,"y":153},{"x":945,"y":436},{"x":915,"y":426},{"x":680,"y":583},{"x":116,"y":472},{"x":930,"y":253},{"x":350,"y":90},{"x":25,"y":273},{"x":359,"y":306},{"x":399,"y":330},{"x":445,"y":109},{"x":370,"y":298},{"x":618,"y":233},{"x":876,"y":474},{"x":739,"y":589},{"x":327,"y":545},{"x":304,"y":554},{"x":934,"y":482},{"x":967,"y":436},{"x":433,"y":106},{"x":551,"y":161},{"x":223,"y":26},{"x":197,"y":64},{"x":906,"y":13},{"x":699,"y":43},{"x":818,"y":566},{"x":743,"y":373},{"x":788,"y":570},{"x":968,"y":222},{"x":620,"y":435},{"x":115,"y":543},{"x":253,"y":573},{"x":288,"y":241},{"x":635,"y":124},{"x":530,"y":132},{"x":84,"y":423},{"x":411,"y":17},{"x":887,"y":169},{"x":867,"y":40},{"x":418,"y":182},{"x":644,"y":25},{"x":352,"y":410},{"x":695,"y":117},{"x":141,"y":438},{"x":192,"y":269},{"x":713,"y":30},{"x":283,"y":93},{"x":205,"y":440},{"x":696,"y":291},{"x":255,"y":252},{"x":80,"y":461},{"x":79,"y":142},{"x":677,"y":468},{"x":588,"y":395},{"x":981,"y":182},{"x":639,"y":127},{"x":860,"y":295},{"x":935,"y":475},{"x":759,"y":447},{"x":83,"y":114},{"x":899,"y":121},{"x":836,"y":321},{"x":86,"y":318},{"x":266,"y":158},{"x":729,"y":227},{"x":284,"y":170},{"x":276,"y":260},{"x":815,"y":119},{"x":58,"y":480},{"x":74,"y":586},{"x":474,"y":22},{"x":21,"y":291},{"x":271,"y":405},{"x":108,"y":112},{"x":163,"y":357},{"x":756,"y":594},{"x":828,"y":267},{"x":21,"y":550},{"x":11,"y":223},{"x":197,"y":477},{"x":937,"y":397},{"x":850,"y":561},{"x":670,"y":406},{"x":101,"y":227},{"x":890,"y":16},{"x":551,"y":209},{"x":985,"y":542},{"x":836,"y":44},{"x":754,"y":161},{"x":194,"y":353},{"x":764,"y":299},{"x":254,"y":414},{"x":485,"y":241},{"x":287,"y":497},{"x":493,"y":41},{"x":144,"y":231},{"x":987,"y":193},{"x":870,"y":436},{"x":880,"y":521},{"x":485,"y":4},{"x":532,"y":244},{"x":55,"y":38},{"x":3,"y":459},{"x":25,"y":126},{"x":469,"y":253},{"x":292,"y":519},{"x":341,"y":334},{"x":705,"y":321},{"x":56,"y":558},{"x":447,"y":461},{"x":234,"y":457},{"x":360,"y":118},{"x":168,"y":18},{"x":38,"y":167},{"x":712,"y":314},{"x":844,"y":453},{"x":11,"y":316},{"x":882,"y":395},{"x":631,"y":339},{"x":234,"y":597},{"x":475,"y":464},{"x":651,"y":307},{"x":462,"y":565},{"x":963,"y":302},{"x":466,"y":406},{"x":714,"y":518},{"x":521,"y":37},{"x":615,"y":541},{"x":259,"y":170},{"x":172,"y":255},{"x":603,"y":570},{"x":192,"y":89},{"x":924,"y":537},{"x":376,"y":142},{"x":990,"y":419},{"x":441,"y":514},{"x":363,"y":522},{"x":591,"y":526},{"x":302,"y":484},{"x":648,"y":84},{"x":523,"y":177},{"x":236,"y":61},{"x":274,"y":581},{"x":625,"y":29},{"x":481,"y":51},{"x":919,"y":204},{"x":805,"y":319},{"x":906,"y":81},{"x":750,"y":309},{"x":403,"y":296},{"x":349,"y":249},{"x":2,"y":253},{"x":586,"y":246},{"x":855,"y":204},{"x":566,"y":178},{"x":347,"y":350},{"x":276,"y":438},{"x":531,"y":503},{"x":733,"y":514},{"x":735,"y":517},{"x":420,"y":583},{"x":857,"y":369},{"x":897,"y":251},{"x":322,"y":347},{"x":352,"y":381},{"x":961,"y":300},{"x":983,"y":60},{"x":346,"y":474},{"x":440,"y":112},{"x":922,"y":530},{"x":193,"y":472},{"x":26,"y":210},{"x":485,"y":562},{"x":386,"y":3},{"x":116,"y":329},{"x":564,"y":127},{"x":213,"y":542},{"x":164,"y":336},{"x":840,"y":357},{"x":795,"y":488},{"x":285,"y":377},{"x":502,"y":561},{"x":116,"y":454},{"x":937,"y":227},{"x":194,"y":325},{"x":228,"y":466},{"x":789,"y":306},{"x":836,"y":414},{"x":131,"y":309},{"x":875,"y":215},{"x":127,"y":215},{"x":90,"y":403},{"x":503,"y":80},{"x":90,"y":6},{"x":129,"y":99},{"x":214,"y":280},{"x":288,"y":57},{"x":132,"y":510},{"x":926,"y":450},{"x":21,"y":130},{"x":248,"y":578},{"x":831,"y":167},{"x":160,"y":196},{"x":622,"y":171},{"x":51,"y":312},{"x":489,"y":27},{"x":777,"y":174},{"x":441,"y":30},{"x":220,"y":401},{"x":301,"y":121},{"x":538,"y":236},{"x":668,"y":349},{"x":637,"y":22},{"x":782,"y":444},{"x":155,"y":569},{"x":94,"y":443},{"x":214,"y":59},{"x":497,"y":353},{"x":488,"y":186},{"x":694,"y":258},{"x":282,"y":443},{"x":978,"y":444},{"x":80,"y":385},{"x":434,"y":494},{"x":747,"y":193},{"x":314,"y":573},{"x":676,"y":17},{"x":746,"y":358},{"x":697,"y":305},{"x":502,"y":232},{"x":756,"y":591},{"x":337,"y":248},{"x":588,"y":403},{"x":649,"y":192},{"x":922,"y":98},{"x":612,"y":598},{"x":226,"y":480},{"x":161,"y":310},{"x":412,"y":473},{"x":680,"y":241},{"x":438,"y":139},{"x":754,"y":327},{"x":248,"y":115},{"x":625,"y":211},{"x":61,"y":137},{"x":174,"y":460},{"x":452,"y":500},{"x":584,"y":462},{"x":179,"y":304},{"x":234,"y":386},{"x":10,"y":538},{"x":530,"y":57},{"x":352,"y":426},{"x":26,"y":294},{"x":590,"y":99},{"x":954,"y":118},{"x":650,"y":401},{"x":819,"y":105},{"x":182,"y":260},{"x":936,"y":238},{"x":30,"y":183},{"x":713,"y":140},{"x":143,"y":270},{"x":796,"y":404},{"x":247,"y":215},{"x":444,"y":286},{"x":196,"y":385},{"x":640,"y":219},{"x":889,"y":7},{"x":427,"y":485},{"x":933,"y":201},{"x":480,"y":67},{"x":923,"y":136},{"x":62,"y":421},{"x":232,"y":124},{"x":881,"y":305},{"x":354,"y":220},{"x":307,"y":543},{"x":437,"y":26},{"x":587,"y":71},{"x":650,"y":548},{"x":932,"y":589},{"x":113,"y":391},{"x":52,"y":52},{"x":193,"y":194},{"x":98,"y":88},{"x":502,"y":598},{"x":311,"y":473},{"x":626,"y":230},{"x":459,"y":179},{"x":651,"y":259},{"x":358,"y":342},{"x":84,"y":161},{"x":326,"y":166},{"x":871,"y":432},{"x":485,"y":321},{"x":111,"y":131},{"x":480,"y":130},{"x":814,"y":232},{"x":587,"y":418},{"x":233,"y":388},{"x":775,"y":582},{"x":948,"y":273},{"x":373,"y":71},{"x":720,"y":33},{"x":262,"y":371},{"x":533,"y":158},{"x":982,"y":127},{"x":64,"y":151},{"x":274,"y":354},{"x":377,"y":450},{"x":388,"y":157},{"x":180,"y":381},{"x":880,"y":330},{"x":650,"y":127},{"x":722,"y":259},{"x":562,"y":458},{"x":390,"y":117},{"x":467,"y":88},{"x":651,"y":279},{"x":740,"y":283},{"x":958,"y":396},{"x":242,"y":137},{"x":350,"y":239},{"x":938,"y":400},{"x":783,"y":198},{"x":352,"y":148},{"x":937,"y":62},{"x":698,"y":505},{"x":132,"y":199},{"x":533,"y":384},{"x":632,"y":204},{"x":996,"y":54},{"x":913,"y":208},{"x":595,"y":214},{"x":636,"y":254},{"x":903,"y":285},{"x":977,"y":543},{"x":977,"y":375},{"x":109,"y":96},{"x":281,"y":401},{"x":143,"y":562},{"x":951,"y":157},{"x":463,"y":1},{"x":886,"y":332},{"x":837,"y":103},{"x":49,"y":82},{"x":803,"y":354},{"x":996,"y":267},{"x":118,"y":125},{"x":668,"y":13},{"x":654,"y":162},{"x":438,"y":356},{"x":58,"y":348},{"x":522,"y":269},{"x":500,"y":337},{"x":241,"y":582},{"x":699,"y":47},{"x":507,"y":54},{"x":763,"y":215},{"x":344,"y":478},{"x":465,"y":500},{"x":790,"y":376},{"x":733,"y":187},{"x":292,"y":433},{"x":251,"y":270}],"bots":[{"x":873,"y":381},{"x":337,"y":524},{"x":219,"y":16},{"x":236,"y":282},{"x":90,"y":89},{"x":500,"y":200}]}

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__trainer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__settings__);




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

window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__entity__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__food__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__settings__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(1);





class Bot extends __WEBPACK_IMPORTED_MODULE_0__entity__["a" /* default */] {
  constructor (genome, x, y) {
    super()
    this._x = x
    this._y = y
    this.x = this._x || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.width)
    this.y = this._y || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.height)
    this.vx = 0 // velocity x
    this.vy = 0 // velocity y

    this.cognition = genome
    this.cognition.score = 0
    this.area = __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.min
    this.visualArea = this.area
    this.aggro = this.area
    this.detected = []
    this.isDead = false
  }

  update () {
    if (this.isDead) {
      this.area = 0
      return
    }

    if (this.area > __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.max) this.area = __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.max
    if (this.area < __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.min) this.area = __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.min

    let input = this.detect()
    let output = this.cognition.activate(input)

    let movementAngle = output[0] * 2 * Math.PI
    let movementSpeed = output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1]

    this.vx = movementSpeed * Math.cos(movementAngle) * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.speed.normal
    this.vy = movementSpeed * Math.sin(movementAngle) * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.speed.normal

    // Speed should be affected by size (larger = more cumbersome)
    this.vx *= Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_2__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.speed.normal)
    this.vy += Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_2__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.speed.normal)

    this.x += this.vx
    this.y += this.vy

    // Force bot to stay in bounds
    this.x = this.x >= __WEBPACK_IMPORTED_MODULE_2__settings___default.a.width ? __WEBPACK_IMPORTED_MODULE_2__settings___default.a.width : this.x <= 0 ? 0 : this.x
    this.y = this.y >= __WEBPACK_IMPORTED_MODULE_2__settings___default.a.height ? __WEBPACK_IMPORTED_MODULE_2__settings___default.a.height : this.y <= 0 ? 0 : this.y

    this.area *= __WEBPACK_IMPORTED_MODULE_2__settings___default.a.size.decrease

    this.cognition.score = this.area

    // Do we do better?
    if (this.cognition.score > window.Game.highestFitness) {
      window.Game.highestFitness = this.cognition.score
      document.getElementById('highest-fitness').innerText = Math.floor(this.cognition.score)
    }
    if (this.cognition.score > window.Game.roundHighestFitness) {
      window.Game.roundHighestFitness = this.cognition.score
    }
  }

  draw () {
    if (this.isDead) {
      return
    }
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* activationColor */])(this.cognition.score, window.Game.highestFitness)

    fill(color)
    ellipse(this.x, this.y, radius)

    if (__WEBPACK_IMPORTED_MODULE_2__settings___default.a.shouldShowDetection || Object(__WEBPACK_IMPORTED_MODULE_3__utils__["c" /* distance */])(mouseX, mouseY, this.x, this.y) < Math.sqrt(this.visualArea / Math.PI)) {
      this.showDetection()
    }
  }

  reset () {
    this.x = this._x || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.width)
    this.y = this._y || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.height)
    this.vx = 0
    this.vy = 0
    this.area = __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.min
    this.visualArea = this.area
  }

  eat (obj) {
    let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["c" /* distance */])(this.x, this.y, obj.x, obj.y)
    let r1 = Math.sqrt(this.area / Math.PI)
    let r2 = Math.sqrt(obj.area / Math.PI)

    if (d < (r1 + r2) / 2 && this.area > obj.area * __WEBPACK_IMPORTED_MODULE_2__settings___default.a.size.relative) {
      this.area += obj.area
      if (obj instanceof __WEBPACK_IMPORTED_MODULE_1__food__["a" /* default */]) {
        obj.reset()
      } else {
        obj.isDead = true
      }
      return true
    }
    return false
  }

  detect () {
    let output = [this.area / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.max]

    let nearestFood = []
    let distanceToFood = Array.apply(null, Array(__WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.food)).map(Number.prototype.valueOf, Infinity)

    let nearestPlayers = []
    let distanceToPlayers = Array.apply(null, Array(__WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.player)).map(Number.prototype.valueOf, Infinity)

    if (window.Game.player) {
      this.eat(window.Game.player)
    }

    for (let player of window.Game.bots.concat(window.Game.randomBots)) {
      if (player === this || this.eat(player)) continue

      let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["c" /* distance */])(this.x, this.y, player.x, player.y)
      if (d < __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.radius) {
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

      let d = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["c" /* distance */])(this.x, this.y, food.x, food.y)
      if (d < __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.radius) {
        let maxNearestDistance = Math.max.apply(null, distanceToFood)
        let i = distanceToFood.indexOf(maxNearestDistance)

        if (d < maxNearestDistance) {
          distanceToFood[i] = d
          nearestFood[i] = food
        }
      }
    }

    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.player; i++) {
      let player = nearestPlayers[i]
      let d = distanceToPlayers[i]

      if (player === undefined) {
        output = output.concat([0, 0, 0])
      } else {
        output.push(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* angleToPoint */])(this.x, this.y, player.x, player.y) / (2 * Math.PI))
        output.push(d / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.radius)
        output.push(player.area / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.area.max)
      }
    }

    for (let j = 0; j < __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.food; j++) {
      let food = nearestFood[j]
      let d = distanceToFood[j]

      if (food === undefined) {
        output = output.concat([0, 0])
      } else {
        output.push(Object(__WEBPACK_IMPORTED_MODULE_3__utils__["b" /* angleToPoint */])(this.x, this.y, food.x, food.y) / (2 * Math.PI))
        output.push(d / __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.radius)
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

    let color = Object(__WEBPACK_IMPORTED_MODULE_3__utils__["a" /* activationColor */])(this.cognition.score, window.Game.highestFitness)
    stroke(color)
    ellipse(this.x, this.y, __WEBPACK_IMPORTED_MODULE_2__settings___default.a.detection.radius * 2)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bot;



/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = [{"nodes":[{"bias":0,"type":"input","squash":"LOGISTIC","index":"0"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"1"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"2"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"3"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"4"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"5"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"6"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"7"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"8"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"9"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"10"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"11"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"12"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"13"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"14"},{"bias":0,"type":"input","squash":"LOGISTIC","index":"15"},{"bias":0.023223715608351375,"type":"hidden","squash":"RELU","index":"16"},{"bias":0.014891492120365196,"type":"hidden","squash":"TANH","index":"17"},{"bias":0.048003316392185136,"type":"hidden","squash":"SOFTSIGN","index":"18"},{"bias":0.040895630780909326,"type":"hidden","squash":"RELU","index":"19"},{"bias":-0.8738603937632018,"type":"output","squash":"LOGISTIC","index":"20"},{"bias":-0.08957754573380693,"type":"output","squash":"LOGISTIC","index":"21"}],"connections":[{"weight":1,"from":"16","to":"16","gater":null},{"weight":1,"from":"17","to":"17","gater":null},{"weight":1,"from":"18","to":"18","gater":null},{"weight":0.7902793755199498,"from":2,"to":16,"gater":null},{"weight":-0.07149821204643265,"from":2,"to":18,"gater":null},{"weight":-0.028641659094852348,"from":0,"to":20,"gater":null},{"weight":0.6220279703535218,"from":5,"to":16,"gater":null},{"weight":0.1715603417657961,"from":4,"to":17,"gater":null},{"weight":-0.05012561315325059,"from":1,"to":20,"gater":null},{"weight":-0.04593491026171775,"from":0,"to":21,"gater":null},{"weight":-0.05557692472839837,"from":1,"to":21,"gater":null},{"weight":0.08970245476505698,"from":2,"to":21,"gater":null},{"weight":0.029644481186653276,"from":8,"to":16,"gater":null},{"weight":-0.016200993624189503,"from":4,"to":20,"gater":null},{"weight":-0.06716644119986781,"from":3,"to":21,"gater":null},{"weight":0.016416659763925173,"from":5,"to":20,"gater":null},{"weight":-0.025467708811180018,"from":4,"to":21,"gater":null},{"weight":0.018988488517768104,"from":9,"to":17,"gater":null},{"weight":-0.06738682163851598,"from":6,"to":20,"gater":null},{"weight":0.07179281243413108,"from":5,"to":21,"gater":null},{"weight":-0.059226911460554144,"from":11,"to":16,"gater":null},{"weight":-0.08440547518208633,"from":7,"to":20,"gater":0},{"weight":-0.09564577797874936,"from":6,"to":21,"gater":null},{"weight":-0.2488621845595294,"from":12,"to":16,"gater":null},{"weight":0.565554784667866,"from":8,"to":20,"gater":null},{"weight":-0.049218492367973626,"from":7,"to":21,"gater":null},{"weight":0.08841721678449796,"from":9,"to":20,"gater":null},{"weight":0.08167308421625427,"from":8,"to":21,"gater":null},{"weight":0.09869927968072023,"from":14,"to":16,"gater":null},{"weight":-0.08215590753777363,"from":15,"to":16,"gater":null},{"weight":-0.009524205285848589,"from":11,"to":20,"gater":null},{"weight":-0.09039543166511571,"from":10,"to":21,"gater":null},{"weight":-0.060772809812552266,"from":13,"to":19,"gater":null},{"weight":0.8652900292449949,"from":12,"to":20,"gater":null},{"weight":0.0484443844896878,"from":11,"to":21,"gater":null},{"weight":-0.029262993823832198,"from":17,"to":16,"gater":null},{"weight":0.0788401348743368,"from":12,"to":21,"gater":null},{"weight":-0.08544350647207191,"from":14,"to":20,"gater":null},{"weight":0.005849037413344194,"from":13,"to":21,"gater":null},{"weight":-0.048973251568819626,"from":15,"to":20,"gater":null},{"weight":-0.5995500651071181,"from":14,"to":21,"gater":null},{"weight":-0.05117024123571334,"from":21,"to":16,"gater":null},{"weight":0.0068386824159885895,"from":20,"to":17,"gater":null},{"weight":-0.02528354662904944,"from":16,"to":21,"gater":null},{"weight":0.04131039957541818,"from":18,"to":20,"gater":null},{"weight":-0.95960628842253,"from":17,"to":21,"gater":null},{"weight":-0.03623494128234138,"from":19,"to":20,"gater":null},{"weight":0.06576915099742814,"from":21,"to":20,"gater":null}],"input":16,"output":2}]

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__settings__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trainer__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__food__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__positions_json__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__positions_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__positions_json__);





class Game {
  constructor () {
    this.food = []
    this.bots = []
    this.randomBots = []
    this.player = null
    this.iterations = 0
    this.highestFitness = 0
    this.roundHighestFitness = 0

    createCanvas(__WEBPACK_IMPORTED_MODULE_0__settings___default.a.width, __WEBPACK_IMPORTED_MODULE_0__settings___default.a.height)

    this.reset()

    if (!__WEBPACK_IMPORTED_MODULE_0__settings___default.a.isTrainedPop) {
      for (let j = 0; j < 15; j++) {
        __WEBPACK_IMPORTED_MODULE_1__trainer__["a" /* default */].neat.mutate()
      }
    }
  }

  reset () {
    this.food = []
    this.bots = []
    this.randomBots = []
    this.player = null
    this.roundHighestFitness = 0

    for (let i = 0; i < __WEBPACK_IMPORTED_MODULE_0__settings___default.a.food.amount; i++) {
      if (__WEBPACK_IMPORTED_MODULE_0__settings___default.a.shouldUseSavedPositions) {
        let item = __WEBPACK_IMPORTED_MODULE_3__positions_json___default.a.food[i % __WEBPACK_IMPORTED_MODULE_3__positions_json___default.a.food.length]
        this.food.push(new __WEBPACK_IMPORTED_MODULE_2__food__["a" /* default */](item.x, item.y))
      } else {
        this.food.push(new __WEBPACK_IMPORTED_MODULE_2__food__["a" /* default */]())
      }
    }
  }

  print () {
    let out = {
      food: this.food.map(f => {
        return {x: f.x, y: f.y}
      }),
      bots: this.bots.map(b => {
        return {x: b.x, y: b.y}
      })
    }
    console.log(JSON.stringify(out))
  }

  update () {
    if (this.iterations === __WEBPACK_IMPORTED_MODULE_0__settings___default.a.iterations) {
      __WEBPACK_IMPORTED_MODULE_1__trainer__["a" /* default */].end()
      this.iterations = 0
    }

    for (let bot of this.bots) {
      bot.update()
    }

    for (let bot of this.randomBots) {
      bot.update()
    }

    if (this.player) {
      this.player.update()
    }
  }

  draw () {
    background(255)
    this.drawGrid()
    this.drawFood()
    this.drawBots()
    this.drawRandomizedBots()
    this.drawPlayer()

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

  drawRandomizedBots () {
    for (let bot of this.randomBots) {
      bot.draw()
    }
  }

  drawPlayer () {
    if (this.player) {
      this.player.draw()
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__food__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__settings___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__settings__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(1);




class Player {
  constructor (x, y) {
    this.x = x || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.width)
    this.y = y || Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.height)
    this.area = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.min
    this.visualArea = this.area
    this.score = 0
  }

  eat (obj) {
    let d = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["c" /* distance */])(this.x, this.y, obj.x, obj.y)
    let r1 = Math.sqrt(this.area / Math.PI)
    let r2 = Math.sqrt(obj.area / Math.PI)

    if (d < (r1 + r2) / 2 && this.area > obj.area * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.size.relative) {
      this.area += obj.area
      if (obj instanceof __WEBPACK_IMPORTED_MODULE_0__food__["a" /* default */]) {
        obj.reset()
      } else {
        obj.isDead = true
      }
      return true
    }
    return false
  }

  update () {
    if (this.isDead) {
      this.area = 0
      this.score = 0
      return
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      let vx = 0
      let vy = 0
      if (keyIsDown(UP_ARROW)) { vy = -1 * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal }
      if (keyIsDown(DOWN_ARROW)) { vy = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal }
      if (keyIsDown(LEFT_ARROW)) { vx = -1 * __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal }
      if (keyIsDown(RIGHT_ARROW)) { vx = __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal }

      vx *= Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal)
      vy *= Math.max(1 - (this.area / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.area.max), __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.min / __WEBPACK_IMPORTED_MODULE_1__settings___default.a.speed.normal)

      this.x += vx
      this.y += vy
    }

    window.Game.food.forEach(f => this.eat(f))
    window.Game.bots.forEach(b => this.eat(b))
    window.Game.randomBots.forEach(rb => this.eat(rb))
  }

  draw () {
    if (this.isDead) {
      return
    }
    this.visualArea = lerp(this.visualArea, this.area, 0.2)
    let radius = Math.sqrt(this.visualArea / Math.PI)
    let color = [0, 0, 0]
    let strokeColor = Object(__WEBPACK_IMPORTED_MODULE_2__utils__["a" /* activationColor */])(this.score, window.Game.highestFitness)

    stroke(strokeColor)
    fill(color)
    ellipse(this.x, this.y, radius)
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;



/***/ })
/******/ ]);
//# sourceMappingURL=neat.bundle.js.map