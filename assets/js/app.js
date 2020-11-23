// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
import socket from "./socket"
import Chart from 'chart.js';
import { Timer } from 'easytimer.js';



document.querySelector('#export .downloadButton').addEventListener("click", () => {
  download_csv();
});

var ctx = document.getElementById('roastChart');
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    // labels: [],
    datasets: [{
      data: [],
      label: "Bean Temperature",
      borderColor: "#3e95cd",
      fill: false,
      pointRadius: [],
      pointBackgroundColor: []
    }
    ]
  },

  options: {
    title: {
      display: true,
      text: 'Roast'
    },
    scales: {
      xAxes: [{
        type: 'time'
      }]
    }
  }
});

let FIRST_CRACK = false;
const firstCrackTimer = new Timer();
document.querySelector('#firstCrackTimer .recordButton').addEventListener("click", () => {
  firstCrackTimer.start();
  FIRST_CRACK = true;
});

firstCrackTimer.addEventListener('start', () => {
  document.querySelector('#firstCrackTimer .values').innerHTML = firstCrackTimer.getTimeValues().toString();
});

firstCrackTimer.addEventListener('secondsUpdated', () => {
  document.querySelector('#firstCrackTimer .values').innerHTML = firstCrackTimer.getTimeValues().toString();
});

firstCrackTimer.addEventListener('reset', () => {
  document.querySelector('#firstCrackTimer .values').innerHTML = firstCrackTimer.getTimeValues().toString();
});

const mainTimer = new Timer();
let COLLECTION_STARTED = false;
document.querySelector('#timer .startButton').addEventListener("click", () => {
  mainTimer.start();
  COLLECTION_STARTED = true;
});

document.querySelector('#timer .stopButton').addEventListener("click", () => {
  mainTimer.stop();
  firstCrackTimer.stop();
  COLLECTION_STARTED = false;
});

document.querySelector('#timer .resetButton').addEventListener("click", () => {
  COLLECTION_STARTED = false;
  myLineChart.data.datasets[0].data = [];
  myLineChart.update();
  mainTimer.reset();
  mainTimer.stop();
  firstCrackTimer.reset();
  firstCrackTimer.stop();
});

mainTimer.addEventListener('secondsUpdated', () => {
  document.querySelector('#timer .values').innerHTML = mainTimer.getTimeValues().toString();
});

mainTimer.addEventListener('started', () => {
  document.querySelector('#timer .values').innerHTML = mainTimer.getTimeValues().toString();
});

mainTimer.addEventListener('reset', () => {
  document.querySelector('#timer .values').innerHTML = mainTimer.getTimeValues().toString();
});

document.querySelector('#timer .startButton').addEventListener("click", () => {
  mainTimer.start();
  COLLECTION_STARTED = true;
});

let CSV_DATA = 'Time,BeanTemperature,FC\n'
function download_csv() {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(CSV_DATA);
  hiddenElement.target = '_blank';
  hiddenElement.download = `roast.csv`;
  hiddenElement.click();
}

let channel = socket.channel("telemetry:lobby", {})
channel.on("temperature", ({ timestamp, bean }) => {
  if (!COLLECTION_STARTED) return;

  myLineChart.data.datasets[0].data.push({
    t: new Date(timestamp),
    y: bean,
  })

  CSV_DATA += `${timestamp},${bean},${FIRST_CRACK}\n`

  if (FIRST_CRACK) {
    myLineChart.data.datasets[0].pointRadius.push(5)
    myLineChart.data.datasets[0].pointBackgroundColor.push('red')
    FIRST_CRACK = false
  } else {
    myLineChart.data.datasets[0].pointRadius.push(3)
    myLineChart.data.datasets[0].pointBackgroundColor.push('blue')
  }


  myLineChart.update();
})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

  


import "phoenix_html"
