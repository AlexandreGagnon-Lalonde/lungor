"use strict"

require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
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
  client.close();
}

const voteOnPoll = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  const { _id, optionName } = req.body;

  try {
    await client.connect();

    const db = client.db('lungor');

    const pollQuery = { _id: ObjectId(`${_id}`) };
    const poll = await db.collection('polls').findOne(pollQuery);

    poll.options.map(option => {
      if (option.optionName === optionName) {
        option.voters.push('1')
      }
      return option
    })

    const pollUpdated = {
      $set: {
        options: poll.options
      }
    }

    const newPoll = await db.collection('polls').updateOne(pollQuery, pollUpdated)
    assert.equal(1, newPoll.matchedCount);
    assert.equal(1, newPoll.modifiedCount);

    res.status(200).json({ status: 200, poll })
  } catch(err) {
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
}

const createUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  const { user } = req.body;
  try {
    await client.connect();

    const db = client.db('lungor');

    const users = await db.collection('users').find().toArray();

    const userAlreadyExist = users.find(userObj => userObj.username === user.username)

    if (!userAlreadyExist) {
      const newUser = await db.collection('users').insertOne(user);
      assert(1, newUser.insertedCount);
      res.status(201).json({ status: 201, user })
    } else {
      res.status(400).json({ status: 400, message: 'Username taken'})
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message })
  }
  client.close();
}

const getUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  const { username } = req.params;
  const { password } = req.body;
  try {
    await client.connect();

    const db = client.db('lungor');

    const users = await db.collection('users').find().toArray();

    const user = users.find(userObj => userObj.username === username)

    const pwdIsOK = user.password === password;
    const userExist = user.username === username;

    if (userExist && pwdIsOK) {
      delete user.password
      res.status(200).json({ status: 200, user })
    } else if (userExist) {
      res.status(400).json({ status: 400, message: 'Wrong Password'})
    } else {
      res.status(400).json({ status: 400, message: 'User not found'})
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message })
  }
  client.close();
}

module.exports = {
  newPoll,
  getPolls,
  voteOnPoll,
  createUser,
  getUser,
}