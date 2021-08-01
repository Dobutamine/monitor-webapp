const { State, validate } = require("../models/state");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // find all states registered for this user and return an array with the names
    let stateNames = await State.find({ id: req.query.id }, "name").exec();

    // if not found then there's no configuration for this id
    if (!stateNames) res.status(400).send("no states found for this id");

    // return all state names
    res.send(stateNames);
  } catch (error) {}
});

router.post("/new", async (req, res) => {
  try {
    // validate the request
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    // configure a new state object
    let state = new State();

    // set the id
    state.id = req.body.id;

    // set the name
    state.name = req.body.name;

    // pass in the configuration
    state.configuration = req.body.configuration;

    // save the state
    state.save();

    // return all users
    res.send("processed new state");
  } catch (error) {}
});

module.exports = router;
