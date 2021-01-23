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
    _id: pollName,
    pollName,
    ...pollOptions,
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

module.exports = {
  newPoll
}