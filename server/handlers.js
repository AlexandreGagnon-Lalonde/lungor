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

  const { _id, title, user } = req.body;
  try {
    await client.connect();

    const db = client.db('lungor');

    const pollQuery = { _id: ObjectId(`${_id}`) };
    const userQuery = { _id: ObjectId(`${user._id}`)};

    const poll = await db.collection('polls').findOne(pollQuery);
    const currentUser = await db.collection('users').findOne(userQuery);

    const didUserVoteOnPoll = currentUser.votes.find(poll => poll === _id);

    poll.options.map(option => {
      if (option.title === title && !option.voters.find(voter => voter === user.username)) {
        option.voters.push(user.username)
        option.value += 1;
      } else if (option.voters.find(voter => voter === user.username)) {
        const indexOfUser = option.voters.indexOf(currentUser.username)
        option.voters.splice(indexOfUser, 1)
        option.value -= 1;
      } else {
        return option
      }
    })

    if (!didUserVoteOnPoll) {
      currentUser.votes.push(_id)
    } else {
      let pollIndex = currentUser.votes.indexOf(_id)
      currentUser.votes.splice(pollIndex, 1)
    }

    const pollUpdated = {
      $set: {
        options: poll.options
      }
    }
    const userUpdated = {
      $set: {
        votes: currentUser.votes
      }
    }

    const newPoll = await db.collection('polls').updateOne(pollQuery, pollUpdated)
    assert.equal(1, newPoll.matchedCount);
    assert.equal(1, newPoll.modifiedCount);

    const newUser = await db.collection('users').updateOne(userQuery, userUpdated)
      assert.equal(1, newUser.matchedCount);
      assert.equal(1, newUser.modifiedCount);

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
  const { password, alreadyLoggedIn } = req.body;
  try {
    await client.connect();

    const db = client.db('lungor');

    const users = await db.collection('users').find().toArray();

    const user = users.find(userObj => userObj.username === username)

    const userExist = user && user.username === username;

    const pwdIsOK = user && user.password === password;

    if (alreadyLoggedIn) {
      delete user.password
      return res.status(200).json({ status: 200, user })
    }

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