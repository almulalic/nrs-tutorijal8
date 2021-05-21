let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index.js");
let should = chai.should();

const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./baza.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the baza.db database.");
});

chai.use(chaiHttp);

describe("Edit Grad", () => {
  beforeEach((done) => {
    db.run("INSERT INTO grad(naziv, broj_stanovnika) VALUES ('GET', 0);", () => {
      insertId = this.lastID;
    });
    db.run("INSERT INTO grad(naziv, broj_stanovnika) VALUES ('GET2', 0);", () => {
      insertId = this.lastID;
    });
    done();
  });

  describe("/GET gradovi", () => {
    it("it should return all gradovi in database", (done) => {
      db.all(`SELECT * FROM grad`, (err, rows) => {
        var lengthBefore = rows.length;

        chai
          .request("http://localhost:3000")
          .get(`/gradovi`)
          .end(async (err, res) => {
            res.should.have.status(200);

            new Promise((resolve, reject) => {
              db.all(`SELECT * FROM grad`, (err, rows) => {
                if (err) {
                  console.log(err);
                  should.fail("SQL Errors");
                  reject();
                } else {
                  resolve(rows);
                }
              });
            }).then((rows) => {
              rows.length.should.equal(lengthBefore);
            });
          });
        done();
      });
    });
  });

  describe("/GET gradovi single", () => {
    it("it should return grad with specified ID", (done) => {
      db.all(`SELECT * FROM grad WHERE naziv='GET'`, (err, rows) => {
        var grad = rows[0];

        chai
          .request("http://localhost:3000")
          .get(`/gradovi/${insertId}`)
          .end(async (err, res) => {
            res.should.have.status(200);

            new Promise((resolve, reject) => {
              db.all(`SELECT * FROM grad WHERE naziv='GET'`, (err, rows) => {
                if (err) {
                  console.log(err);
                  should.fail("SQL Errors");
                  reject();
                } else {
                  resolve(rows[0]);
                }
              });
            }).then((grad) => {
              grad.should.equal(grad);
            });
          });
        done();
      });
    });
  });

  afterEach((done) => {
    db.exec("DELETE FROM grad WHERE naziv='GET'");
    db.exec("DELETE FROM grad WHERE naziv='GET2'");
    done();
  });
});
