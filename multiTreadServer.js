import express from "express";
const app = express();
import { Worker } from "worker_threads";
import os from "os";

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    //first argument is filename of the worker
    const worker = new Worker("./sumOfPrimesWorker.js", {
      workerData,
    });
    worker.on("message", resolve); //This promise is gonna resolve when messages comes back from the worker thread
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

function divideWorkAndGetSum() {
  // we are hardcoding the value 600000 for simplicity and dividing it
  //into 4 equal parts
  console.log(">>>", os.cpus().length);
  const start1 = 2;
  const end1 = 75000;
  const start2 = 75001;
  const end2 = 150000;
  const start3 = 150001;
  const end3 = 225000;
  const start4 = 225001;
  const end4 = 300000;
  const start5 = 300001;
  const end5 = 375000;
  const start6 = 375001;
  const end6 = 450000;
  const start7 = 450001;
  const end7 = 525000;
  const start8 = 525001;
  const end8 = 600000;
  //allocating each worker seperate parts
  const worker1 = runWorker({ start: start1, end: end1 });
  const worker2 = runWorker({ start: start2, end: end2 });
  const worker3 = runWorker({ start: start3, end: end3 });
  const worker4 = runWorker({ start: start4, end: end4 });
  const worker5 = runWorker({ start: start5, end: end5 });
  const worker6 = runWorker({ start: start6, end: end6 });
  const worker7 = runWorker({ start: start7, end: end7 });
  const worker8 = runWorker({ start: start8, end: end8 });
  //Promise.all resolve only when all the promises inside the array has resolved
  return Promise.all([
    worker1,
    worker2,
    worker3,
    worker4,
    worker5,
    worker6,
    worker7,
    worker8,
  ]);
}

app.get("/sumofprimeswiththreads", async (req, res) => {
  const startTime = new Date().getTime();
  const sum = await divideWorkAndGetSum()
    .then(
      (
        values //values is an array containing all the resolved values
      ) => values.reduce((accumulator, part) => accumulator + part.result, 0) //reduce is used to sum all the results from the workers
    )
    .then((finalAnswer) => finalAnswer);

  const endTime = new Date().getTime();
  res.json({
    number: 600000,
    sum: sum,
    timeTaken: (endTime - startTime) / 1000 + " seconds",
  });
});

app.listen(7777, () => console.log("listening on port 7777"));
