var assert = require("assert");
const { Crashes } = require("../Models/model");
const axios = require("axios");

let get_body_info = () => {
  return {
    year: "2011",
    month: "01",
    day: "01",
    time: "15:25",
    city: "Surgut",
    country: "Russia",
    operator: "Kogalmavia",
    flightNo: "348",
    route: "Surgut - Moscow",
    aircraftType: "Tupolev Tu-154B-2",
    registration: "RA-85588",
    cnIn: "83A588",
    aboard: "124",
    fatalities: "3",
    ground: "0",
    summary:
      "The passenger jet caught fire and exploded as it taxied for take off. Three passenger were killed and 43 injured during the evacuation. Electrical short.",
  };
};

describe("Crashes Tests with Mocha", function () {
  describe("Test Model", function () {
    describe("Crash", function () {
      it("1. Test Crash Model", function () {
        let body = get_body_info();
        let crash = new Crashes(body);
        assert.strictEqual(crash.year, "2011");
        assert.strictEqual(crash.month, "01");
        assert.strictEqual(crash.day, "01");
        assert.strictEqual(crash.time, "15:25");
        assert.strictEqual(crash.city, "Surgut");
        assert.strictEqual(crash.country, "Russia");
        assert.strictEqual(crash.operator, "Kogalmavia");
        assert.strictEqual(crash.flightNo, "348");
        assert.strictEqual(crash.route, "Surgut - Moscow");
        assert.strictEqual(crash.aircraftType, "Tupolev Tu-154B-2");
        assert.strictEqual(crash.registration, "RA-85588");
        assert.strictEqual(crash.cnIn, "83A588");
        assert.strictEqual(crash.aboard, "124");
        assert.strictEqual(crash.fatalities, "3");
        assert.strictEqual(crash.ground, "0");
        assert.strictEqual(
          crash.summary,
          "The passenger jet caught fire and exploded as it taxied for take off. Three passenger were killed and 43 injured during the evacuation. Electrical short."
        );
      });

      it("2. Test Invalid Year", async function () {
        let body = get_body_info();
        body.year = "Cyberpunk 2077";
        let test_year = new Crashes(body);
        assert.strictEqual(await test_year.isValid(), false);
      });

      it("3. Test Invalid Fatalities", async function () {
        let body = get_body_info();
        body.fatalities = "death note";
        let test_fatalities = new Crashes(body);
        assert.strictEqual(await test_fatalities.isValid(), false);
      });

      it("4. Test Invalid City", async function () {
        let body = get_body_info();
        body.city = "den@34mark";
        let test_city = new Crashes(body);
        assert.strictEqual(await test_city.isValid(), false);
      });

      it("5. Test Invalid Registration", async function () {
        let body = get_body_info();
        body.registration = "(at(hMeIfU(an";
        let test_registration = new Crashes(body);
        assert.strictEqual(await test_registration.isValid(), false);
      });

      it("6. Test Invalid Time", async function () {
        let body = get_body_info();
        body.time = "15:789";
        let test_time = new Crashes(body);
        assert.strictEqual(await test_time.isValid(), false);
      });
    });
  });
  describe("API Endpoint Testing", function () {
    describe("Crashes", async function () {
      it("1. POST - Fail Invalid Crash ", async function () {
        const url = "http://localhost:8080";
        let body = get_body_info();
        body.year = "abc";
        body.city = "!nval!d";
        body.registration = "RA-85588^_^";

        await axios.post(`${url}/crashes`, body).then((result) => {
          assert.strictEqual(
            result.data,
            "Error. Crash not inserted in the database due to invalid data."
          );
        });
      });

      it("2. POST - Pass Valid Crash", async function () {
        const url = "http://localhost:8080";
        let body = get_body_info();
        await axios.post(`${url}/crashes`, body).then((result) => {
          if (
            result.data ==
            "Error. Crash not inserted in the database due to invalid data."
          ) {
            assert.fail(result.data);
          }
        });
      });

      it("3. GET - Get Crash Info By Registration", async function () {
        const url = "http://localhost:8080";
        let registration = "RA-85588";
        await axios
          .get(`${url}/crashes/registration/${registration}`)
          .then((result) => {
            assert.equal(result.data.length, get_body_info().length);
          });
      });

      it("4. PUT - Update Crash", async function () {
        const url = "http://localhost:8080";
        let body = get_body_info();
        body.year = "2010";
        body.time = "14:30";
        await axios
          .put(`${url}/crashes/${body.registration}`, body)
          .then((result) => {
            assert.strictEqual(result.data.acknowledged, true);
            assert.strictEqual(result.data.modifiedCount, 1);
          });
      });

      it("5. DELETE - Delete Crash", async function () {
        const url = "http://localhost:8080";
        await axios.delete(`${url}/crashes/RA-85588`).then((result) => {
          assert.strictEqual(result.data.acknowledged, true);
        });
      });

      it("6. GET - Get Total Crashes In One Year", async function () {
        const url = "http://localhost:8080";
        await axios.get(`${url}/crashes/count/${2009}`).then((result) => {
          let number = result.data.number;
          assert.strictEqual(number, 11);
        });
      });

      it("7. GET - Get Total Fatalaties In One Year", async function () {
        const url = "http://localhost:8080";
        await axios
          .get(`${url}/crashes/count/fatalities/${2000}`)
          .then((result) => {
            let number = result.data.number;
            assert.strictEqual(number, 403);
          });
      });
    });
  });
});
