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


var ctx = document.getElementById('myChart');
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        // labels: [],
        datasets: [{ 
            data: [],
            label: "Bean Temperature",
            borderColor: "#3e95cd",
            fill: false
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


let channel = socket.channel("telemetry:lobby", {})

channel.on("temperature", ({ bean, timestamp }) => {
    myLineChart.data.labels.push(new Date(timestamp))
    console.log('new temp', bean, timestamp)
    myLineChart.data.datasets[0].data.push({
        t: new Date(timestamp),
        y: bean
    })
    myLineChart.update();

})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })


import "phoenix_html"
