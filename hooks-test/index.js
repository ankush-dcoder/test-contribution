const {
  Worker, MessageChannel,isMainThread, parentPort
} = require('worker_threads')
if (isMainThread) {
  const worker = new Worker('./main.js');
  const { port1, port2 } = new MessageChannel()
  port1.unref()
  port2.unref()
  worker.postMessage({ _port: port2 }, [port2]);
  port1.on('message', (value) => {
    console.log('received:', value);
  });
  // setTimeout(() => {
  //   worker.terminate()
  // }, 5000)
} else {
  parentPort.once('message', (value) => {
    // assert(value.hereIsYourPort instanceof MessagePort);
    value._port.postMessage('the worker is sending this');
    value._port.close();
  });
}