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
    db.run("INSERT INTO grad(naziv, broj_stanovnika) VALUES ('DELETE', 0);", () => {
      insertId = this.lastID;
    });
    done();
  });

  describe("/DELETE grad", () => {
    it("it should DELETE grad with naziv=DELETE", (done) => {
      var insertId = -1;

      db.all(`SELECT * FROM grad WHERE naziv='DELETE'`, (err, row) => {
        insertId = row[0].ID;

        chai
          .request("http://localhost:3000")
          .delete(`/gradovi/:${insertId}`)
          .end(async (err, res) => {
            res.should.have.status(200);

            new Promise((resolve, reject) => {
              db.all(`SELECT * FROM grad WHERE ID='${insertId}'`, (err, rows) => {
                if (err) {
                  console.log(err);
                  should.fail("SQL Errors");
                  reject();
                } else {
                  resolve(rows);
                }
              });
            }).then((rows) => {
              rows.length.should.equal(0);
            });
          });
        done();
      });
    });
  });

  after((done) => {
    db.exec("DELETE FROM grad WHERE naziv='DELETE'");
    done();
  });
});
