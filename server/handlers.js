"use strict"

require("dotenv").config();
const { MongoClient } = require("mongodb");
const assert = require("assert");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = {

}