const { wait, clone } = require("../utils")
// const { printTable } = require("console-table-printer")
const cTable = require("console.table")

const solveFirstComeFirstServe = (processes, n) => {
  let counter = 0
  let toProcess = clone(processes)
  let requestQueue = []
  let visual = []
  let currState = {}

  const getNextState = () => {
    let lastState = currState[requestQueue[0].processName].split("->")
    lastState = lastState[lastState.length - 1]

    let nextState = lastState

    if (lastState === "NEW") nextState = "NEW->READY->RUNNING"

    if (lastState === "READY") nextState = "READY->RUNNING"

    if (parseInt(requestQueue[0].clockCycle) - 1 === 0)
      nextState = `${nextState}->TERMINATED`

    return nextState
  }

  // Assume that all processes are created beforehand
  for (const process of processes) currState[process.processName] = "NEW"

  let indexToPush = -1

  const pushToRequestQueue = () => {
    requestQueue.push(toProcess[indexToPush])
    toProcess.splice(indexToPush, 1)
  }

  const jobArrived = () => {
    let index = toProcess.findIndex((p) => parseInt(p.arrivalTime) === counter)
    if (index !== -1) {
      indexToPush = index
      currState = {
        ...currState,
        [toProcess[indexToPush].processName]: "NEW->READY",
      }
    }
    return parseInt(index) !== -1
  }

  const jobAvailable = () => requestQueue.length

  // Runs job, ret 1 if finished running job
  const runJob = () => {
    let requestQueueCopy = [...requestQueue]

    let nextProcessStateOfRunning = getNextState()

    // Update visuals
    visual.push({
      TIME: counter,
      CPU: requestQueue[0].processName,
      QUEUE: JSON.stringify(
        requestQueueCopy.filter((p, i) => i > 0).map((p) => p.processName)
      ),
      ...{
        ...currState,
        [requestQueue[0].processName]: nextProcessStateOfRunning,
      },
    })
    currState = {
      ...currState,
      [requestQueue[0].processName]: nextProcessStateOfRunning,
    }

    requestQueue[0].clockCycle--

    let finishedRunningJob = parseInt(requestQueue[0].clockCycle) === 0

    if (finishedRunningJob) {
      requestQueue.shift()
      return true
    }
    return false
  }

  const cpuWaiting = () =>
    visual.push({ TIME: counter, CPU: "", QUEUE: "[]", ...currState })

  const getFinishedProcessName = (keys) => {
    for (const key of keys)
      if (currState[key].includes("RUNNING->TERMINATED")) return key

    return false
  }
  const getReadyProcessName = (keys) => {
    for (const key of keys)
      if (currState[key].includes("NEW->READY")) return key
    return false
  }

  // Main Loop
  while (toProcess.length || jobAvailable()) {
    console.clear()
    let hasFinishedFirstOnQueue
    if (jobArrived()) pushToRequestQueue()
    if (jobAvailable()) hasFinishedFirstOnQueue = runJob()
    if (
      !jobArrived() &&
      !jobAvailable() &&
      toProcess.length &&
      !hasFinishedFirstOnQueue
    )
      cpuWaiting()

    console.table(visual)

    const processName = getFinishedProcessName(Object.keys(currState))
    const readyProcessName = getReadyProcessName(Object.keys(currState))
    if (processName)
      currState = {
        ...currState,
        [processName]: "TERMINATED",
      }

    wait(2000)
    counter++
  }
  // for (let i = 0; i < processes.length; i++) {
  //   let toFind = processes[i]

  //   let startTimeFound = false
  //   let endTimeFound = false

  //   for (let j = 0; j < visual.length; j++) {
  //     if(startTimeFound && endTimeFound) break
  //     let startCursor = j
  //     let endCursor = visual.length - 1 - j
  //   }
  // }

  let stat = []

  for (const process of processes)
    stat.push({
      Process: process.processName,
      "Average Running Time": process.clockCycle,
    })

  console.table(stat)
}

module.exports = {
  solveFirstComeFirstServe,
}
