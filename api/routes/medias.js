const express = require("express");
const router = express.Router();
const _ = require("lodash");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

const mediaFolder = path.join(process.cwd(), "public");

router.get("/list", async (req, res) => {
  try {
    fs.readdir(mediaFolder, (err, files) => {
      if (err) {
        res.status(400).send("no media files found");
      }
      // process the filelist to only show jpg or mp4
      res.send(files);
    });
  } catch (error) {}
});

router.get("/", (req, res) => {
  const filename = req.query.item;
  res.send("OK");
});

router.post("/upload", async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.uploadDir = mediaFolder;

    form.parse(req, (_, fields, files) => {
      const key = Object.keys(files);
      const currentFileName = files[key].path;
      const newFilename = mediaFolder + "/" + files[key].name;
      fs.renameSync(currentFileName, newFilename, (err) => {
        console.log(err);
      });
      res.send("Thank you");
    });
  } catch (error) {}
});

module.exports = router;
