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

const simplify = (processes, visual) => {
  let visualCopy = clone(visual)
  for (let i = 0; i < processes.length; i++) {
    let name = processes[i]
    console.log(name)
    for (let j = 0; j < visual.length; ) {
      if (j === visual.length - 1) break
      if (visual[j][name] !== visual[j + 1][name]) {
        j = j + 1
      } else {
        let k
        for (k = j + 2; k < visual.length; k++) {
          if (visual[k][name] !== visual[j][name]) {
            break
          }
        }

        let firstDup = j + 1
        let lastDup = k - 1
        let lastState = visual[j][name].split("->")
        lastState = lastState[lastState.length - 1]

        while (firstDup <= lastDup) {
          visualCopy[firstDup][name] = lastState
          firstDup++
        }

        j = k
      }
    }
  }

  return visualCopy
}

module.exports = {
  simplify,
  showMainOptions,
  showNonPreemptiveOptions,
  showPreemptiveOptions,
  getInputs,
  wait,
  keypress,
  simplify,
  clone,
}
