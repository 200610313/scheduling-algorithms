const { solveRoundRobin } = require("../preemptive")

const solveFirstComeFirstServe = (processes, n) => {
  solveRoundRobin(processes,n,-1)
}

module.exports = {
  solveFirstComeFirstServe,
}
