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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(0)
const bodyParser = __webpack_require__(1)
const fs = __webpack_require__(7)
const http = __webpack_require__(2)
const path = __webpack_require__(3)
const rimraf = __webpack_require__(8)
const settings = __webpack_require__(9)

const port = process.env.PORT || 3000

let app = express()
let server = http.Server(app)

app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use('/libs', express.static(path.join(__dirname, '../../../libs')))
app.use('/dist', express.static(path.join(__dirname, '../../../dist')))

if (settings.shouldRunClean) {
  rimraf.sync('../training-data')
}

app.get('/', (req, res, next) => {
  res.sendFile(path.join(path.resolve(__dirname, '..'), 'index.html'))
})

app.post('/store', (req, res, next) => {
  let generation = req.body.generation
  let data = req.body.data
  let average = req.body.averageFitness
  let roundHighestFitness = req.body.roundHighestFitness

  if (!fs.existsSync('../training-data')) {
    fs.mkdirSync('../training-data')
  }
  if (!fs.existsSync('../training-data/statistics.csv')) {
    fs.writeFileSync('../training-data/statistics.csv', '')
  }

  fs.appendFile('../training-data/statistics.csv', `${generation},${average},${roundHighestFitness}\n`, () => {
    fs.writeFile(`../training-data/generation-${generation}.json`, data, (err) => {
      res.json({stored: !err})
    })
  })
})

server.on('listening', () => console.log(`Listening on ::${port}`))
server.listen(port)

/* WEBPACK VAR INJECTION */}.call(exports, "src/neat/server"))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("rimraf");

/***/ }),
/* 9 */
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


/***/ })
/******/ ]);
//# sourceMappingURL=neat-server.bundle.js.map