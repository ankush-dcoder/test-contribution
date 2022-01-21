// console.log("Hello")
const {
  Worker, isMainThread, parentPort
} = require('worker_threads')
const hookStd = require("hook-std")

const messageHandler = async (message) => {
  const hooks = {}
  const log = function log (msg, type) {
    message._port.postMessage({
      _type: "LOGGING",
      message: msg,
      type,
      ts: new Date().toISOString(),
    })
  }

  hooks.stdout = hookStd.stdout(chunk => log(chunk, "stdout"))
  hooks.stderr = hookStd.stderr(chunk => log(chunk, "stderr"))

  let returnValue = ''
  try {
    const userCode = require('./step')
    const returnValue = await userCode.run()
  } catch (err) {
    console.error(err)
  }
  message._port.postMessage({
    _type: "SYSTEM",
    returnValue: data,
    message: 'Finished',
    type: 'FINISH',
    ts: new Date().toISOString(),
  })
  hooks.stdout.unhook()
  hooks.stderr.unhook()
}

if (!isMainThread) {
  parentPort.on("message", messageHandler)
}