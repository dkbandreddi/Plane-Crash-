// const Crash = require("../Models/Crash");
const db = require("../utils/db");
const axios = require("axios");
const v = require("../utils/validate-fields");
const Crashes = require("../Models/model").Crashes;
const geodata = require("../utils/geodata");
const mongo = require("mongodb");
/**
 * A function that gets a random crash record
 * from the database.
 * @param {*} req
 * @param {*} res
 */

async function getCrashCollection() {
  let dbConnection = await db.getDb();
  return await dbConnection.collection("crashes");
}

module.exports.getAllYears = async (req, res) => {
  let crash = await getCrashCollection();
  crash.distinct("year").then((result) => {
    res.send({ years: result });
  });
};

module.exports.getAllCountries = async (req, res) => {
  let crash = await getCrashCollection();
  crash.distinct("country").then((result) => {
    res.send({ country: result });
  });
};

module.exports.getCrashById = async (req, res) => {
  const id = new mongo.ObjectId(req.params.id);
  let crash = await getCrashCollection();
  crash.findOne({ _id: id }, (err, doc) => {
    if (err) throw err;
    res.send(doc);
  });
};

module.exports.getRandomCrashInfo = async (req, res) => {
  let crash = await getCrashCollection();

  crash.count().then(async (count) => {
    let random = Math.floor(Math.random() * count);
    crash
      .find({}, { skip: random, limit: 1, projection: { _id: 0 } })
      .toArray((err, data) => {
        if (err) throw err;
        res.send(data[0]);
      });
  });
};

module.exports.getYearlyCrashInfo = async (req, res) => {
  let year = req.params.year;
  let crash = await getCrashCollection();
  crash.find({ year: year }).toArray((err, arr) => {
    res.send(arr);
  });
};

module.exports.getCrashesYearCount = async (req, res) => {
  let year = req.params.year;
  let crash = await getCrashCollection();
  crash
    .find({
      year: year,
    })
    .toArray((err, data) => {
      res.send({ number: data.length });
    });
};

module.exports.getFatalitiesYearCount = async (req, res) => {
  let year = req.params.year;
  let crash = await getCrashCollection();
  crash
    .find({
      year: year,
    })
    .toArray((err, data) => {
      if (err) throw err;
      let fatalities = 0;
      data.forEach((crash) => {
        fatalities += parseInt(crash.fatalities);
      });
      res.send({ number: fatalities });
    });
};

module.exports.getGeolocation = async (req, res) => {
  let address = req.params.address;
  geodata
    .getAddressMapQuestAPI(address)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      throw err;
    });
};

module.exports.postCrashInfo = async (req, res) => {
  let new_crash = new Crashes(req.body);
  var valid = await new_crash.isValid();
  if (valid) {
    let crash = await getCrashCollection();
    crash.insertOne(new_crash, (err, obj) => {
      if (err) throw `Encountered an error when inserting data... ${err}`;
      res.send(obj);
    });
  } else {
    res.send("Error. Crash not inserted in the database due to invalid data.");
  }
};

module.exports.deleteCrashInfo = async (req, res) => {
  let reg = req.params.reg;
  let crash = await getCrashCollection();
  crash.deleteMany({ registration: reg }, (err, obj) => {
    if (err) throw `Encountered an error when deleting data... ${err}`;
    res.send(obj);
  });
};

module.exports.deleteCrash = async (req, res) => {
  let id = new mongo.ObjectId(req.params.id);
  let crash = await getCrashCollection();
  crash.deleteOne({ _id: id }, (err, obj) => {
    if (err) throw err;
    res.send({ msg: "Crash information deleted from the DB" });
  });
};

module.exports.updateCrash = async (req, res) => {
  let new_crash = new Crashes(req.body);
  let id = new mongo.ObjectId(req.params.id);
  var valid = await new_crash.isValid();
  if (valid) {
    let crash = await getCrashCollection();
    crash.updateOne({ _id: id }, { $set: new_crash }, (err, obj) => {
      if (err) throw `Encountered an error when updating data... ${err}`;
      res.send({ msg: "Crash information updated successfully!" });
    });
  } else {
    console.log(
      "The Crash record was not updated in the database since it is not valid."
    );
    res.send("Error. Crash not updated in the database.");
  }
};

module.exports.updateCrashInfo = async (req, res) => {
  let new_crash = new Crashes(req.body);
  let registration = req.params.reg;
  var valid = await new_crash.isValid();
  if (valid) {
    let crash = await getCrashCollection();
    crash.updateOne(
      { registration: registration },
      { $set: new_crash },
      (err, obj) => {
        if (err) throw `Encountered an error when updating data... ${err}`;
        res.send(obj);
      }
    );
  } else {
    console.log(
      "The Crash record was not updated in the database since it is not valid."
    );
    res.send("Error. Crash not updated in the database.");
  }
};

module.exports.getCrashesByCountry = async (req, res) => {
  let country = req.params.country.toLowerCase();
  let crash = await getCrashCollection();
  crash.find({ country: country }).toArray((err, arr) => {
    res.send(arr);
  });
};

module.exports.getCrashInfoByRegistration = async (req, res) => {
  let reg = req.params.reg;
  let crash = await getCrashCollection();
  crash.findOne(
    {
      registration: reg,
    },
    (err, obj) => {
      if (err) throw err;
      res.send(obj);
    }
  );
};

module.exports.getYearlyFatalitiesGraph = async (req, res) => {
  let data = [];
  let promises = [];
  let crash = await getCrashCollection();
  crash.distinct("year").then((result) => {
    result.forEach((y) => {
      promises.push(
        axios
          .get(`http://localhost:8080/crashes/count/fatalities/${y}`)
          .then((response) => {
            data.push({
              year: y,
              fatalities: response.data.number,
            });
          })
      );
    });
    Promise.all(promises).then(() => {
      let x = [];
      let y = [];
      data.forEach((obj) => {
        x.push(obj.year);
        y.push(obj.fatalities);
      });
      res.send({ plot: [{ x: x, y: y, type: "bar" }] });
    });
  });
};

module.exports.getYearlyCrashesGraph = async (req, res) => {
  let data = [];
  let promises = [];
  let crash = await getCrashCollection();
  crash.distinct("year").then((result) => {
    result.forEach((y) => {
      promises.push(
        axios
          .get(`http://localhost:8080/crashes/count/${y}`)
          .then((response) => {
            data.push({
              year: y,
              crashes: response.data.number,
            });
          })
      );
    });
    Promise.all(promises).then(() => {
      let x = [];
      let y = [];
      data.forEach((obj) => {
        x.push(obj.year);
        y.push(obj.crashes);
      });
      res.send({ plot: [{ x: x, y: y, type: "bar" }] });
    });
  });
};
