const { wait } = require("../utils")
const solveFirstComeFirstServe = (processes, n) => {
  // Sort according to
  processes = processes.sort((a, b) =>
    a.arrivalTime > b.arrivalTime ? 1 : b.arrivalTime > a.arrivalTime ? -1 : 0
  )
  let copy = processes

  processes = processes.map((p, i) => ({ ...p, processState: "BLOCKED" }))
  console.table(processes)
  console.log("")

  console.log(`\n As jobs arrive, they are put at the end of the queue.\n`)
  processes = processes.map((p, i) => ({ ...p, processState: "READY" }))

  for (let index = 0; index < processes.length; index++) {
    console.table(processes.slice(0, index + 1))
  }

  while (processes.length) {
    // Then start processing
    if (processes.length === n)
      console.log(
        `\n${processes[0].processName} is first job and run immedialtely.\n`
      )
    else
      console.log(`\n${processes[0].processName} is next in queue and run.\n`)
    processes = processes.map((p, i) =>
      i === 0
        ? { ...p, processState: "RUNNING" }
        : { ...p, processState: "READY" }
    )

    console.table(processes)

    // Processing first in queue
    while (processes[0].clockCycle > 0) {
      console.log(".")
      wait(1000)
      processes[0].clockCycle--
    }

    console.log(`\nFinished job ${processes[0].processName}\n`)

    // Then dequeue
    processes.shift()
  }
}

module.exports = {
  solveFirstComeFirstServe,
}
