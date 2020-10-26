const input = require("readline-sync")

const showMainOptions = (params) =>
  console.log("[1] Reset input\n[2] Non Preemptive\n[3] Preemptive")

const showNonPreemptiveOptions = (params) =>
  console.log("\n[1] First Come First Serve\n")
const showPreemptiveOptions = (params) => console.log("\n[1] Round Robin\n")

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
const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false)
      resolve()
    })
  )
}
function clone(a) {
  return JSON.parse(JSON.stringify(a))
}

module.exports = {
  showMainOptions,
  showNonPreemptiveOptions,
  showPreemptiveOptions,
  getInputs,
  wait,
  keypress,
  clone,
}
