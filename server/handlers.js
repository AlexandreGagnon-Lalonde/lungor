"use strict"

require("dotenv").config();
const { MongoClient } = require("mongodb");
const assert = require("assert");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const newPoll = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  const { pollOptions, pollName } = req.body;
  const pollBody = {
    pollName,
    options: pollOptions
  };

  try {
    await client.connect();

    const db = client.db('lungor');

    const poll = await db.collection('polls').insertOne(pollBody)
    assert(1, poll.insertedCount);

    res.status(201).json({ status: 201, success: true });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
}

const getPolls = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = client.db('lungor');

    const polls = await db.collection('polls').find().toArray();

    res.status(200).json({ status: 200, polls })
  } catch(err) {
    res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = {
  newPoll,
  getPolls,
}