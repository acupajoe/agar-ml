import Trainer from './trainer'
import Game from './game'
import settings from '../settings'

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

  window.Game = new Game()
  window.Trainer = Trainer
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
