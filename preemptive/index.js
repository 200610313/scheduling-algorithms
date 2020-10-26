const { wait, clone } = require("../utils")
// const { printTable } = require("console-table-printer")
const cTable = require("console.table")

const solveRoundRobin = (processes, n) => {
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

  let QUANTUM = 2
  let jobCounter = 0
  jobCounter = 0
  let expiredJob
  let finishedFirstInQueue = false
  let visuals = []
  while (toProcess.length || jobAvailable()) {
    const run = () => {
      if (jobArrived()) pushToRequestQueue()

      if (expiredJob) {
        requestQueue.push(expiredJob)
        expiredJob = undefined
      }

      if (jobAvailable()) {
        if (!(QUANTUM === jobCounter)) {
          console.log(requestQueue[0].processName, " ran at " + counter)
          // console.log("Runnning " + requestQueue[0].processName)
          finishedFirstInQueue = runJob()

          // If last was Terminated
          if (!jobAvailable() && !toProcess.length) {
            return
          }

          // if (counter === 1) {
          //   console.log("object")
          // }

          // let newState

          // if (currState[requestQueue[0].processName] === "NEW->READY")
          //   newState = `NEW->READY->RUNNING`
          // else {
          //   let lastState = currState[requestQueue[0].processName].split("->")
          //   lastState = lastState[lastState.length - 1]
          //   // Valid transitions to get a job to RUNNING state
          //   if (lastState === "NEW") newState = `${lastState}->READY->RUNNING`
          //   else if (lastState === "RUNNING") newState = `${lastState}`
          //   else if (lastState === "BLOCKED")
          //     newState = `${lastState}->READY->RUNNING`
          //   else newState = `${lastState}->RUNNING`

          if (finishedFirstInQueue) {
            jobCounter = 0
            finishedFirstInQueue = true
            // newState = `${lastState}->TERMINATED`
          } else {
            jobCounter++
          }
          // }

          // let requestQueueCopy = [...requestQueue]
          // visual.push({
          //   TIME: counter,
          //   CPU: requestQueue[0].processName,
          //   QUEUE: JSON.stringify(
          //     requestQueueCopy.filter((p, i) => i > 0).map((p) => p.processName)
          //   ),
          //   ...{
          //     ...currState,
          //     [requestQueue[0].processName]: newState,
          //   },
          // })
          // currState = {
          //   ...currState,
          //   [requestQueue[0].processName]: newState,
          // }
        } else {
          // Job blocked before time ( counter ) started
          console.log(requestQueue[0].processName + " Expired at " + counter)

          expiredJob = requestQueue[0]

          // visual[visual.length - 1] = {
          //   ...visual[visual.length - 1],
          //   [expiredJob.processName]: `${
          //     visual[expiredJob.processName]
          //   }->BLOCKED`,
          // }

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
  console.table(visual)
}

module.exports = {
  solveRoundRobin,
}
