// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import deps with the dep name or local files with a relative path, for example:
//
//     import {Socket} from "phoenix"
import socket from "./socket";
import Chart from "chart.js";
import { Timer } from "easytimer.js";

document
  .querySelector("#export .downloadButton")
  .addEventListener("click", () => {
    download_csv();
  });

let FAN, HEAT, TEMPERATURE;
document
  .querySelector("#controlLogs .recordTelemetry")
  .addEventListener("click", () => {
    FAN = parseInt(document.getElementById("fan").value);
    HEAT = parseInt(document.getElementById("heat").value);
    TEMPERATURE = parseInt(document.getElementById("temperature").value);
  });

const ctx = document.getElementById("roastChart");
const myLineChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [
      {
        data: [],
        label: "Bean Temperature",
        yAxisID: "bean",
        borderColor: "#3e95cd",
        fill: false,
        pointRadius: [],
        pointBackgroundColor: [],
      },
      {
        data: [],
        label: "Fan",
        yAxisID: "fan",
        borderColor: "green",
        fill: false,
      },
      {
        data: [],
        label: "Power",
        yAxisID: "power",
        borderColor: "black",
        fill: false,
      },
      {
        data: [],
        label: "Env. Temperature",
        yAxisID: "envTemp",
        borderColor: "purple",
        fill: false,
      },
    ],
  },

  options: {
    title: {
      display: true,
      text: "Roast",
    },
    scales: {
      xAxes: [
        {
          type: "time",
        },
      ],
      yAxes: [
        {
          id: "bean",
          ticks: { min: 0 },
        },
        {
          id: "fan",
          ticks: { min: 0, max: 9, stepSize: 1 },
        },
        {
          id: "power",
          ticks: { min: 0, max: 9, stepSize: 1 },
        },
        {
          id: "envTemp",
          ticks: { min: 0 },
        },
      ],
    },
  },
});

let FIRST_CRACK = false;
let FC_TIME = 0;
let START_TIME = 0
const firstCrackTimer = new Timer();
document
  .querySelector("#firstCrackTimer .recordButton")
  .addEventListener("click", () => {
    firstCrackTimer.start();
    FIRST_CRACK = true;
    FC_TIME = new Date()
  });

firstCrackTimer.addEventListener("start", () => {
  document.querySelector(
    "#firstCrackTimer .values"
  ).innerHTML = firstCrackTimer.getTimeValues().toString();
});

firstCrackTimer.addEventListener("secondsUpdated", () => {
  document.querySelector(
    "#firstCrackTimer .values"
  ).innerHTML = firstCrackTimer.getTimeValues().toString();
  document.querySelector(
    "#firstCrackTimer .percent"
  ).innerHTML = `${(100 * (new Date() - FC_TIME)/(FC_TIME - START_TIME)).toFixed()}%`
});

firstCrackTimer.addEventListener("reset", () => {
  document.querySelector(
    "#firstCrackTimer .values"
  ).innerHTML = firstCrackTimer.getTimeValues().toString();
  document.querySelector(
    "#firstCrackTimer .precent"
  ).innerHTML = "0%";
});

const mainTimer = new Timer();
let COLLECTION_STARTED = false;
document.querySelector("#timer .startButton").addEventListener("click", () => {
  mainTimer.start();
  START_TIME = new Date()
  COLLECTION_STARTED = true;
});

document.querySelector("#timer .stopButton").addEventListener("click", () => {
  mainTimer.stop();
  firstCrackTimer.stop();
  COLLECTION_STARTED = false;
});

document.querySelector("#timer .resetButton").addEventListener("click", () => {
  COLLECTION_STARTED = false;
  myLineChart.data.datasets[0].data = [];
  myLineChart.data.datasets[1].data = [];
  myLineChart.data.datasets[2].data = [];
  myLineChart.data.datasets[3].data = [];
  myLineChart.update();
  mainTimer.reset();
  mainTimer.stop();
  firstCrackTimer.reset();
  firstCrackTimer.stop();
  CSV_DATA = "Time,BeanTemperature,FC,FAN,HEAT,TEMPERATURE\n";
});

mainTimer.addEventListener("secondsUpdated", () => {
  document.querySelector(
    "#timer .values"
  ).innerHTML = mainTimer.getTimeValues().toString();
});

mainTimer.addEventListener("started", () => {
  document.querySelector(
    "#timer .values"
  ).innerHTML = mainTimer.getTimeValues().toString();
});

mainTimer.addEventListener("reset", () => {
  document.querySelector(
    "#timer .values"
  ).innerHTML = mainTimer.getTimeValues().toString();
});

// document.querySelector("#timer .startButton").addEventListener("click", () => {
//   mainTimer.start();
//   COLLECTION_STARTED = true;
// });

let CSV_DATA = "Time,BeanTemperature,FC,FAN,HEAT,TEMPERATURE\n";
function download_csv() {
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(CSV_DATA);
  hiddenElement.target = "_blank";
  hiddenElement.download = `roast.csv`;
  hiddenElement.click();
}

let channel = socket.channel("telemetry:lobby", {});
channel.on("temperature", ({ timestamp, bean }) => {
  if (!COLLECTION_STARTED) return;

  myLineChart.data.datasets[0].data.push({
    t: new Date(timestamp),
    y: bean,
  });

  CSV_DATA += `${timestamp},${bean},${FIRST_CRACK},${FAN},${HEAT},${TEMPERATURE}\n`;

  if (FIRST_CRACK) {
    myLineChart.data.datasets[0].pointRadius.push(5);
    myLineChart.data.datasets[0].pointBackgroundColor.push("red");
    FIRST_CRACK = false;
  } else {
    myLineChart.data.datasets[0].pointRadius.push(3);
    myLineChart.data.datasets[0].pointBackgroundColor.push("blue");
  }

  const t = new Date(timestamp);
  myLineChart.data.datasets[1].data.push({
    t,
    y: FAN,
  });
  myLineChart.data.datasets[2].data.push({
    t,
    y: HEAT,
  });
  myLineChart.data.datasets[3].data.push({
    t,
    y: TEMPERATURE,
  });

  myLineChart.update();
});
channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

import "phoenix_html";
