const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const db = require("../utils/db");
let dbConnection;
const dataArray = [];

async function laodDB() {
  await db.connectDB();
  dbConnection = await db.getDb();
  let collectionsList = await dbConnection
    .listCollections({}, { nameOnly: true })
    .toArray();
  collectionsList.forEach(async (element) => {
    if (element.name == "crashes") {
      console.log("Collections exist");
      await dbConnection.collection("crashes").drop((err, success) => {
        if (err)
          throw `Encountered and error while dropping collection... ${err}`;
        if (success) console.log("Dropping previous DB...");
      });
    }
  });
}

laodDB();

async function insertData() {
  //Read CSV file and insert data into DB
  fs.createReadStream(path.resolve(__dirname, "../resources/crash_data.csv"))
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      let splitDate = row.Date.split("/");
      let location = row.Location.split(",");
      let newCrash = {
        year: splitDate[2],
        month: splitDate[0],
        day: splitDate[1],
        time: row.Time,
        city: location[0].trim().toLowerCase(),
        country: location[1].trim().toLowerCase(),
        operator: row.Operator,
        flightNo: row.FlightNo,
        route: row.Route,
        aircraftType: row.Type,
        registration: row.Registration,
        cnIn: row.cnIn,
        aboard: row.Aboard,
        fatalities: row.Fatalities,
        ground: row.Ground,
        summary: row.Summary,
      };

      dataArray.push(newCrash);
    })
    .on("end", async () => {
      let crashCollection = await dbConnection.collection("crashes");
      crashCollection
        .insertMany(dataArray)
        .then(() => {
          console.log(
            `DB operation to insert ${dataArray.length} documents have been successufully completed.`
          );
          process.exit(1);
        })
        .catch((err) => {
          console.log(
            "Encountered an error when inserting documents in DB. " + err
          );
        });
    });
}

insertData();
