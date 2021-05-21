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
  before((done) => {
    db.run("INSERT INTO grad(naziv, broj_stanovnika) VALUES ('PUT', 0);", () => {
      insertId = this.lastID;
    });
    done();
  });

  describe("/PUT grad", () => {
    it("it should PUT/UPDATE grad with naziv=PUT and broj_stanovnika=0 to broj_stanovnika=12345", (done) => {
      var insertId = -1;

      db.all(`SELECT * FROM grad WHERE naziv='PUT'`, (err, row) => {
        insertId = row[0].ID;

        chai
          .request("http://localhost:3000")
          .put(`/gradovi/:${insertId}`)
          .send({
            broj_stanovnika: 12345,
          })
          .end(async (err, res) => {
            res.should.have.status(200);

            new Promise((resolve, reject) => {
              db.all(`SELECT * FROM grad WHERE ID='${insertId}'`, (err, row) => {
                if (err) {
                  console.log(err);
                  should.fail("SQL Errors");
                  reject();
                } else {
                  console.log(row[0].broj_stanovnika);
                  resolve(row[0].broj_stanovnika);
                }
              });
            }).then((broj_stanovnika) => {
              broj_stanovnika.should.equal(12345);
            });
          });
        done();
      });
    });
  });

  after((done) => {
    db.exec("DELETE FROM grad WHERE naziv='PUT'");
    done();
  });
});
