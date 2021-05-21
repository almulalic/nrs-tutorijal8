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

describe("Create Grad", () => {
  before((done) => {
    db.exec("DELETE FROM grad WHERE naziv='TEST'");
    done();
  });

  describe("/POST grad", () => {
    it("it should POST/CREATE new grad with naziv=TEST and broj_stanovnika=0", (done) => {
      chai
        .request("http://localhost:3000")
        .post("/grad")
        .send({
          naziv: "TEST",
          broj_stanovnika: 0,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("string");
          done();
        });
    });
  });

  after((done) => {
    db.exec("DELETE FROM grad WHERE naziv='TEST'");
    done();
  });
});
