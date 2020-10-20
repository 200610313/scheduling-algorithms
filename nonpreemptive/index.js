const { wait } = require("../utils")

const solveFirstComeFirstServe = (processes, n) => {
  let counter = 0
  let toProcess = processes
  let requestQueue = []

  let indexToPush = -1

  const pushToRequestQueue = () => {
    requestQueue.push(toProcess[indexToPush])
    toProcess.splice(indexToPush, 1)
  }

  const jobArrived = () => {
    let index = toProcess.findIndex((p) => parseInt(p.arrivalTime) === counter)
    if (index !== -1) indexToPush = index
    return parseInt(index) !== -1
  }

  const jobAvailable = () => requestQueue.length

  const runJob = () => {
    console.log(JSON.stringify(requestQueue[0]))
    requestQueue[0].clockCycle--
    if (parseInt(requestQueue[0].clockCycle) === 0) requestQueue.shift()
  }

  while (toProcess.length || jobAvailable()) {
    if (jobArrived()) {
      pushToRequestQueue()
    }

    if (jobAvailable()) {
      runJob()
    }

    counter++
  }
}

module.exports = {
  solveFirstComeFirstServe,
}
