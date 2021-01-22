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

const {} = require('./handlers');

app.get('/', (req,res) => res.send('helloFromServer'));

app.listen(PORT, () => console.log(`Listening on PORt ${PORT}`))

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
