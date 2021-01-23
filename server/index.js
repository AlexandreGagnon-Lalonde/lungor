"use strict"

require("dotenv").config();
const { MongoClient } = require("mongodb");
const assert = require("assert");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


const express = require('express');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

const { newPoll } = require('./handlers');

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Origin", "*");
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(bodyParser.json())
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))


  .get('/', (req,res) => res.send('helloFromServer'))
  .post('/api/newpoll', () => console.log('newPoll'))

  .listen(PORT, () => console.log(`Listening on PORt ${PORT}`))

// const POLL = {
//   _id: 'pollName',
//   A: [],
//   B: [],
//   C: [],
//   D: [],
// }

// const importPoll = async () => {
//   const client = await MongoClient(MONGO_URI, options);
//   try {
//     await client.connect();

//     const db = client.db("lungor");

//     const newPoll = await db.collection("polls").insertOne(POLL);
//     assert.equal(1, newPoll.insertedCount);

//     console.log("success");
//   } catch (err) {
//     console.log(err.stack);
//   }
//   client.close();
// };

// importPoll();
