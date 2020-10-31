const input = require("readline-sync")
const { solveFirstComeFirstServe } = require("./nonpreemptive")
const { solveRoundRobin } = require("./preemptive")
const {
  getInputs,
  showMainOptions,
  showNonPreemptiveOptions,
  showPreemptiveOptions,
} = require("./utils")

let processes = []
let inputLength = 0

let exit = false
let currOption = 0

while (!exit) {
  if (inputLength === 0) {
    processes = getInputs(processes)
    inputLength = processes.length
  } else {
    showMainOptions()
    currOption = input.question("Option: ")
    if (parseInt(currOption) === 1) {
      processes = getInputs(processes)
    } else if (parseInt(currOption) === 2) {
      // Non Preemptive
      showNonPreemptiveOptions()
      currOption = input.question("Option: ")
      if (parseInt(currOption) === 1)
        solveFirstComeFirstServe(processes, inputLength)
    } else if (parseInt(currOption) === 3) {
      // Preemptive
      showPreemptiveOptions()
      currOption = input.question("Option: ")
      if (parseInt(currOption) === 1) solveRoundRobin(processes, inputLength)
    } else {
      currOption = input.question("Option: ")
    }
  }
}
