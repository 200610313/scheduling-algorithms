const { wait, getStats, clone, simplify, correct } = require("../utils")
// const { printTable } = require("console-table-printer")
const cTable = require("console.table")
const input = require("readline-sync")

const solveRoundRobin = (processes, n, q) => {
  let counter = 0
  let toProcess = clone(processes)
  let requestQueue = []
  let visual = []
  let currState = {}

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
      if (toProcess[index].processName === "P2") {
        console.log("object")
      }
      indexToPush = index
      transitionProcessToState(
        toProcess[indexToPush].processName,
        "READY",
        toProcess[indexToPush].clockCycle
      )
    }
    return parseInt(index) !== -1
  }

  const jobAvailable = () => requestQueue.length

  // Runs job, ret the name of the process if finished running job
  const runJob = () => {
    requestQueue[0].clockCycle--
    let finishedRunningJob = parseInt(requestQueue[0].clockCycle) === 0
    if (finishedRunningJob) {
      let processNameOfFinished = requestQueue[0].processName
      requestQueue.shift()
      return processNameOfFinished
    }
    return false
  }

  if (!q) q = input.question("Enter Quantum: ")

  let QUANTUM = parseInt(q)

  console.log("Quantum is set to ", q)

  let jobCounter = 0
  jobCounter = 0
  let expiredJob
  let finishedFirstInQueue

  const cpuWaiting = () =>
    visual.push({
      TIME: counter,
      CPU: "",
      QUEUE: "[]",
      ...currState,
    })

  const isPristine = (processName, length) =>
    parseInt(
      processes.find((p) => p.processName === processName).clockCycle
    ) === length

  const transitionProcessToState = (processName, endState) => {
    if (
      currState[processName] === "NEW->READY" &&
      endState === "RUNNING" &&
      !visual.find((p) => p[processName] === "NEW")
      // visual[visual.length - 1][processName].split("->").pop() === "NEW"
    ) {
      let nextState = `${currState[processName]}->RUNNING`
      currState = { ...currState, [processName]: nextState }
      return nextState
    }

    let previousState = currState[processName].split("->")
    previousState = previousState[previousState.length - 1]

    if (endState === "RUNNING") {
      if (previousState === "READY") {
        let nextState = "READY->RUNNING"
        currState = { ...currState, [processName]: nextState }
        return nextState
      }

      if (previousState === "NEW") {
        let nextState = "NEW->READY->RUNNING"
        currState = { ...currState, [processName]: nextState }
        return nextState
      }

      if (previousState === "BLOCKED") {
        let nextState = "BLOCKED->READY->RUNNING"
        currState = { ...currState, [processName]: nextState }
        return nextState
      }

      if (previousState === "RUNNING") {
        let nextState = "RUNNING"
        currState = { ...currState, [processName]: nextState }
        return nextState
      }
    }
    if (endState === "BLOCKED") {
      let nextState = `${previousState}->BLOCKED`
      currState = { ...currState, [processName]: nextState }
      return nextState
    }
    if (endState === "TERMINATED") {
      let nextState = `${currState[processName]}->TERMINATED`
      currState = { ...currState, [processName]: nextState }
      return nextState
    }
    if (endState === "READY") {
      let nextState = `NEW->READY`
      currState = { ...currState, [processName]: nextState }
      return nextState
    }
  }

  while (toProcess.length || jobAvailable()) {
    const run = () => {
      if (counter === 9) {
        console.log("w")
      }
      if (jobArrived()) pushToRequestQueue()

      if (expiredJob) {
        requestQueue.push(expiredJob)
        expiredJob = undefined
      }

      if (jobAvailable()) {
        if (!(QUANTUM === jobCounter)) {
          let requestQueueCopy = [...requestQueue]
          console.log(requestQueue[0].processName, " ran at " + counter)
          visual.push({
            TIME: counter,
            CPU: requestQueue[0].processName,
            QUEUE: JSON.stringify(
              requestQueueCopy.filter((p, i) => i > 0).map((p) => p.processName)
            ),
            ...{
              ...currState,
              [requestQueue[0].processName]: transitionProcessToState(
                requestQueue[0].processName,
                "RUNNING"
              ),
            },
          })
          finishedFirstInQueue = runJob()

          if (finishedFirstInQueue) {
            console.log(finishedFirstInQueue + " terminated at " + counter)

            visual[visual.length - 1] = {
              ...visual[visual.length - 1],
              [finishedFirstInQueue]: transitionProcessToState(
                finishedFirstInQueue,
                "TERMINATED",
                0
              ),
            }

            jobCounter = 0
          } else {
            jobCounter++
          }
        } else {
          // Job blocked before time ( counter ) started
          console.log(requestQueue[0].processName + " Expired at " + counter)

          expiredJob = requestQueue[0]

          visual[visual.length - 1] = {
            ...visual[visual.length - 1],
            [expiredJob.processName]: transitionProcessToState(
              expiredJob.processName,
              "BLOCKED"
            ),
          }

          requestQueue.shift()

          jobCounter = 0

          // Run
          run()
        }
      } else cpuWaiting()
    }
    run()
    counter++
  }
  // Remove dupes
  visual = simplify(
    processes.map(({ processName }) => processName),
    visual
  )
  console.table(visual)
  // Show TAT
  let stats = getStats(
    processes.map(({ processName }) => processName),
    visual
  )
  console.table(stats)

  console.log(
    "AVE TAT = ",
    parseFloat(
      stats.reduce((a, b) => a + parseInt(b.TAT), 0) / parseFloat(stats.length)
    )
  )
  console.log("")
}

module.exports = {
  solveRoundRobin,
}
