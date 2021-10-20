const { Lab, validate } = require("../models/lab");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // try to determine if a configuration for this id is found
    let lab = await Lab.findOne({ id: req.query.id });

    // if not found then there's no configuration for this id
    if (!lab) res.status(400).send("no lab found for this id");

    // return all users
    res.send(lab);
  } catch (error) {}
});

router.post("/new", async (req, res) => {
  try {
    // validate the request
    const { error } = validate(req.body);
    
    if (error) { 
      res.status(400).send(error.details[0].message)
    }

    // try to determine if a configuration for this id is found
    let lab = await Lab.updateOne({ id: req.body.id }, req.body);

    // if not found then there's no configuration for this id
    if (!lab) res.status(400).send("no lab found for this id");

    res.send('OK')

  } catch (error) {}
});

module.exports = router;
