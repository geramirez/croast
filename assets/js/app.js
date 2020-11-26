// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import "../css/app.scss";
import "milligram"

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
  .querySelector("#recordTelemetry")
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
        label: "Fan",
        yAxisID: "fan-power",
        borderColor: "green",
        fill: false,
      },
      {
        data: [],
        label: "Power",
        yAxisID: "fan-power",
        borderColor: "black",
        fill: false,
      },
      {
        data: [],
        label: "Bean Temperature",
        yAxisID: "temp",
        borderColor: "#3e95cd",
        fill: false,
        pointRadius: [],
        pointBackgroundColor: [],
      },
      {
        data: [],
        label: "Env. Temperature",
        yAxisID: "temp",
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
          id: "temp",
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Temperature',
            fontColor: '#000000',
            fontSize: 10
          },
          ticks: { min: 0, max: 550, },
        },
        {
          id: "fan-power",
          ticks: { min: 0, max: 20, stepSize: 1 },
          position: 'right',
          scaleLabel: {
            display: true,
            labelString: 'Fan/Power',
            fontColor: '#000000',
            fontSize: 10
          },
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
    FAN = parseInt(document.getElementById("fan").value);
    HEAT = parseInt(document.getElementById("heat").value);
    TEMPERATURE = parseInt(document.getElementById("temperature").value);
    FC_TIME = new Date()
    document.querySelector('#firstCrackTimer .recordButton').style.display = "none";
  });

firstCrackTimer.addEventListener("start", () => {
  document.querySelector(
    "#developmentPercent"
  ).innerHTML = "0%";
})

firstCrackTimer.addEventListener("secondsUpdated", () => {
  document.querySelector(
    "#developmentPercent"
  ).innerHTML = `${(100 * (new Date() - FC_TIME) / (FC_TIME - START_TIME)).toFixed()}%`
});

firstCrackTimer.addEventListener("reset", () => {
  document.querySelector(
    "#developmentPercent"
  ).innerHTML = "0%";
});

const mainTimer = new Timer();
let COLLECTION_STARTED = false;
document.querySelector("#timer .startButton").addEventListener("click", () => {
  mainTimer.start();
  START_TIME = new Date()
  COLLECTION_STARTED = true;
  FIRST_CRACK = false;
  FC_TIME = 0;
  document.querySelector('#timer .startButton').style.display = "none";
  document.querySelector('#timer .stopButton').style.display = "inline";
});

document.querySelector("#timer .stopButton").addEventListener("click", () => {
  mainTimer.stop();
  firstCrackTimer.stop();
  COLLECTION_STARTED = false;
  document.querySelector('#timer .stopButton').style.display = "none";
  document.querySelector('#timer .resetButton').style.display = "inline";
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

  document.querySelector(
    "#developmentPercent"
  ).innerHTML = "0%";

  CSV_DATA = "Time,BeanTemperature,FC,FAN,HEAT,TEMPERATURE\n";
  document.querySelector('#timer .resetButton').style.display = "none";
  document.querySelector('#timer .startButton').style.display = "inline";
  document.querySelector('#firstCrackTimer .recordButton').style.display = "inline";
});

mainTimer.addEventListener("secondsUpdated", () => {
  document.querySelector(
    "#roastTime"
  ).innerHTML = mainTimer.getTimeValues().toString();
});

mainTimer.addEventListener("started", () => {
  document.querySelector(
    "#roastTime"
  ).innerHTML = mainTimer.getTimeValues().toString();
});

mainTimer.addEventListener("reset", () => {
  document.querySelector(
    "#roastTime"
  ).innerHTML = mainTimer.getTimeValues().toString();
});

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

  document.querySelector('#beanTemperature').innerHTML = bean;

  const t = new Date(timestamp)
  myLineChart.data.datasets[0].data.push({
    t,
    y: FAN,
  });
  myLineChart.data.datasets[1].data.push({
    t,
    y: HEAT,
  });
  myLineChart.data.datasets[2].data.push({
    t,
    y: bean,
  });
  myLineChart.data.datasets[3].data.push({
    t,
    y: TEMPERATURE,
  });

  CSV_DATA += `${timestamp},${bean},${FIRST_CRACK},${FAN},${HEAT},${TEMPERATURE}\n`;
  if (FIRST_CRACK) {
    myLineChart.data.datasets[2].pointRadius.push(5);
    myLineChart.data.datasets[2].pointBackgroundColor.push("red");
    FIRST_CRACK = false;
  } else {
    myLineChart.data.datasets[2].pointRadius.push(3);
    myLineChart.data.datasets[2].pointBackgroundColor.push("blue");
  }
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

import "phoenix_html"
