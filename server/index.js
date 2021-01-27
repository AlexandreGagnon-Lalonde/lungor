"use strict"

require("dotenv").config();

const express = require('express');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const { newPoll, getPolls } = require('./handlers');

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
  .get('/api/getpolls', getPolls)
  .post('/api/newpoll', newPoll)

  .listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
