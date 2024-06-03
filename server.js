const express = require("express");
const fs = require("fs");
const { readFile, writeFile } = require("fs/promises");
const uuid = require("./helpers/uuid");
// above are needed modules to npm install

const path = require("path");
const noteData = require("./db/db.json");

// declaring which port to use
const PORT = 3001;

const app = express();

// middleware to convert data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files from 'public' directory to user
app.use(express.static(path.join(__dirname, "public")));

// absolute path from the root directory to the index.html, from C:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html")); // join C: path ----> html path
});

// absolute path from the root directory to the notes.html, from C:
app.get("/notes", (req, res) => {
  // when returning a file in a get request, we use res.sendFile()
  res.sendFile(path.join(__dirname, "/public/notes.html")); // join C: path ----> html path
});

app.get("/api/notes", (req, res) => {
  // simple terms: grab the data and automatically parse it into json
  res.json(noteData);
});

// POST request
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  // using uuid function to assign unique id for each new note
  req.body.id = uuid();
  // pushing new note into the noteData (db.json) array
  noteData.push(req.body);

  // write the notes to the db.json file with error handling
  fs.writeFile("./db/db.json", JSON.stringify(noteData), (err) => {
    if (err) {
      res.status(500).json({ Error: "" });
    }
    err ? console.error(err) : console.log("Successfully saved note!");
  });
  res.json(noteData);
});

// listening for requests
app.listen(PORT, () => {
  console.log(`Hosting server at http://localhost:${PORT}`);
});
