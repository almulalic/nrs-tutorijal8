const express = require("express");
const app = express();
const port = 3000;
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

let db = new sqlite3.Database("./baza.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the baza.db database.");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/skripta", (req, res) => {
  res.sendFile(__dirname + "/skripta.js");
});

app.post("/grad", async (req, res) => {
  var result;

  await db.run(
    `INSERT INTO grad (naziv, broj_stanovnika) VALUES (?, ?)`,
    [req.body.naziv, req.body.broj_stanovnika],
    (err, row) => {
      if (err) {
        console.log(err);
        result = "SQL ERROR";
        res.status(400);
      } else {
        result = `Inserted row`;
      }

      res.json(result);
    }
  );
});

app.put("/gradovi/:id", async (req, res) => {
  var result;

  await db.each(
    `UPDATE grad SET broj_stanovnika = ? WHERE id = ?`,
    [req.body.broj_stanovnika, req.params.id],
    (err, row) => {
      if (err) {
        console.log(err);
        result = "SQL ERROR";
        res.status(400);
      } else {
        console.log(row);
        result = `Updated row ${req.params.id}`;
      }

      res.json(result);
    }
  );
});

app.get("/gradovi", async (req, res) => {
  await db.all(`SELECT * FROM grad`, (err, rows) => {
    if (err) {
      console.log(err);
      result = "SQL ERROR";
      res.status(400);
    } else {
      result = rows;
    }

    res.json(result);
  });
});

app.get("/gradovi/:id", async (req, res) => {
  await db.all(`SELECT * FROM grad WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      result = "SQL ERROR";
      res.status(400);
    } else {
      result = row;
    }

    res.json(result);
  });
});

app.delete("/gradovi/:id", async (req, res) => {
  await db.run(`DELETE FROM grad WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      result = "SQL ERROR";
      res.status(400);
    } else {
      result = `Row ${req.params.id} deleted`;
    }

    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
