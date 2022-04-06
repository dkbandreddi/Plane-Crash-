const express = require("express");
const app = express();
const crashes = require("./Controller/crashes");
const db = require("./utils/db");

//Body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect and Load Database
async function laodDB() {
  await db.connectDB();
}

laodDB();

app.use(express.static(__dirname + "/view"));

app.listen("8080", () => {
  console.log("Server up and running on port 8080");
});
app.get("/crashes/years", crashes.getAllYears);
app.get("/crashes/countries", crashes.getAllCountries);
app.get("/crashes/:id", crashes.getCrashById);
app.get("/crash/", (req, res) => {
  res.sendFile(__dirname + "/view/crash.html");
});
app.get("/crashes/year/:year", crashes.getYearlyCrashInfo);
app.get("/crashes/random", crashes.getRandomCrashInfo);
app.get("/crashes/count/:year", crashes.getCrashesYearCount);
app.get("/crashes/count/fatalities/:year", crashes.getFatalitiesYearCount);
app.get("/crashes/country/:country", crashes.getCrashesByCountry);
app.get("/crashes/registration/:reg", crashes.getCrashInfoByRegistration);
app.get(
  "/crashes/graph/yearly-fatalities-graph",
  crashes.getYearlyFatalitiesGraph
);
app.get("/crashes/graph/yearly-crashes-graph", crashes.getYearlyCrashesGraph);
app.get("/crashes/geolocation/:address", crashes.getGeolocation);
app.post("/crashes", crashes.postCrashInfo);
app.delete("/crashes/:id", crashes.deleteCrash);
app.put("/crashes/:id", crashes.updateCrash);
app.delete("/crashes/:reg", crashes.deleteCrashInfo);
app.put("/crashes/:reg", crashes.updateCrashInfo);
