const input = require("readline-sync")

const showMainOptions = (params) =>
  console.log("[1] Reset input\n[2] Non Preemptive\n[3] Preemptive")

const showNonPreemptiveOptions = (params) =>
  console.log("\n[1] First Come First Serve\n")

const getInputs = (processes) => {
  processes = [] // Reset
  inputLength = input.question("")
  let n = inputLength

  // Getting processes
  while (n > 0) {
    let x = input.question("")
    x = x.split(" ")

    // Parse input as process
    let process = {
      processName: x[0],
      arrivalTime: x[1],
      clockCycle: x[2],
    }
    processes.push(process)
    n--
  }
  return processes
}
function wait(ms) {
  var start = new Date().getTime()
  var end = start
  while (end < start + ms) {
    end = new Date().getTime()
  }
}
module.exports = {
  showMainOptions,
  showNonPreemptiveOptions,
  getInputs,
  wait
}
