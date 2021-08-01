const { Config, validate } = require("../models/config");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // try to determine if a configuration for this id is found
    let configuration = await Config.findOne({ id: req.query.id });

    // if not found then there's no configuration for this id
    if (!configuration)
      res.status(400).send("no configuration found for this id");

    // return all users
    res.send(configuration);
  } catch (error) {}
});

router.post("/new", async (req, res) => {
  try {
    // validate the request
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    // try to determine if a configuration for this id is found
    let configuration = await Config.findOne({ id: req.body.id });

    // if not found then there's no configuration for this id
    if (!configuration)
      res.status(400).send("no configuration found for this id");

    // set the new configuration
    configuration.configuration = req.body.configuration;

    // sevae it
    configuration.save();

    // return all users
    res.send("processed new configuration");
  } catch (error) {}
});

module.exports = router;
