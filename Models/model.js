const v = require("../utils/validate-fields");

class Crashes {
  constructor(body) {
    this.year = body.year;
    this.month = body.month;
    this.day = body.day;
    this.time = body.time;
    this.city = body.city;
    this.country = body.country;
    this.operator = body.operator;
    this.flightNo = body.flightNo;
    this.route = body.route;
    this.aircraftType = body.aircraftType;
    this.registration = body.registration;
    this.cnIn = body.cnIn;
    this.aboard = body.aboard;
    this.fatalities = body.fatalities;
    this.ground = body.ground;
    this.summary = body.summary;
  }
  async isValid() {
    return v.validate_fields(
      this.year,
      this.month,
      this.day,
      this.time,
      this.city,
      this.country,
      this.operator,
      this.flightNo,
      this.route,
      this.aircraftType,
      this.registration,
      this.cnIn,
      this.aboard,
      this.fatalities,
      this.ground,
      this.summary
    );
  }
}

module.exports.Crashes = Crashes;
