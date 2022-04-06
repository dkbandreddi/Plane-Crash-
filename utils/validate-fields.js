let validator = require("validator");

let _validate_year = (year) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isNumeric(year);
    if (is_valid) {
      resolve("The year is valid.");
    } else {
      reject("The year is invalid.");
    }
  });
};

let _validate_month = (month) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isNumeric(month);
    if (is_valid) {
      resolve("The month is valid.");
    } else {
      reject("The month is invalid.");
    }
  });
};

let _validate_day = (day) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isNumeric(day);
    if (is_valid) {
      resolve("The day is valid.");
    } else {
      reject("The day is invalid.");
    }
  });
};

let _validate_time = (time) => {
  return new Promise((resolve, reject) => {
    let is_valid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
    if (is_valid.test(time)) {
      resolve("The time is valid.");
    } else {
      reject("The time is invalid.");
    }
  });
};

let _validate_city = (city) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlpha(city, "en-US", { ignore: " . ' -" });
    if (is_valid) {
      resolve("The city is valid.");
    } else {
      reject("The city is invalid.");
    }
  });
};

let _validate_country = (country) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlpha(country, "en-US", { ignore: " " });
    if (is_valid) {
      resolve("The country is valid.");
    } else {
      reject("The country is invalid.");
    }
  });
};

let _validate_operator = (operator) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlpha(operator, "en-US", { ignore: " /  " });
    if (is_valid) {
      resolve("The operator is valid.");
    } else {
      reject("The operator is invalid.");
    }
  });
};

let _validate_flightNo = (flightNo) => {
  return new Promise((resolve, reject) => {
    let is_valid = false;
    if (flightNo == "" || flightNo == "-") {
      is_valid = true;
    } else {
      is_valid = validator.isNumeric(flightNo);
    }
    if (is_valid) {
      resolve("The Flight Number is valid.");
    } else {
      reject("The Flight Number is invalid.");
    }
  });
};

let _validate_route = (route) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlpha(route, "en-US", { ignore: " ' -" });
    if (is_valid) {
      resolve("The route is valid.");
    } else {
      reject("The route is invalid.");
    }
  });
};

let _validate_aircraftType = (aircraftType) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlphanumeric(aircraftType, "en-US", {
      ignore: " -",
    });
    if (is_valid) {
      resolve("The Aircraft Type is valid.");
    } else {
      reject("The Aircraft Type is invalid.");
    }
  });
};

let _validate_registration = (registration) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlphanumeric(registration, "en-US", {
      ignore: "-",
    });
    if (is_valid) {
      resolve("The registration is valid.");
    } else {
      reject("The registration is invalid.");
    }
  });
};

let _validate_cnIn = (cnIn) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlphanumeric(cnIn, "en-US", { ignore: " / . ' -" });
    if (is_valid) {
      resolve("The cnIn is valid.");
    } else {
      reject("The cnIn is invalid.");
    }
  });
};

let _validate_aboard = (aboard) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isNumeric(aboard);
    if (is_valid) {
      resolve("The aboard is valid.");
    } else {
      reject("The aboard is invalid.");
    }
  });
};

let _validate_fatalities = (fatalities) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isNumeric(fatalities);
    if (is_valid) {
      resolve("The fatalities is valid.");
    } else {
      reject("The fatalities is invalid.");
    }
  });
};

let _validate_ground = (ground) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isNumeric(ground);
    if (is_valid) {
      resolve("The ground fatalities is valid.");
    } else {
      reject("The ground fatalities is invalid.");
    }
  });
};

let _validate_summary = (summary) => {
  return new Promise((resolve, reject) => {
    let is_valid = validator.isAlphanumeric(summary, "en-US", {
      ignore: " . - , ",
    });
    if (is_valid) {
      resolve("The summary is valid.");
    } else {
      reject("The summary is invalid.");
    }
  });
};

module.exports.validate_fields = (
  year,
  month,
  day,
  time,
  city,
  country,
  operator,
  flightNo,
  route,
  aircraftType,
  registration,
  cnIn,
  aboard,
  fatalities,
  ground,
  summary
) => {
  return Promise.all([
    _validate_year(year),
    _validate_month(month),
    _validate_day(day),
    _validate_time(time),
    _validate_city(city),
    _validate_country(country),
    _validate_operator(operator),
    _validate_flightNo(flightNo),
    _validate_route(route),
    _validate_aircraftType(aircraftType),
    _validate_registration(registration),
    _validate_cnIn(cnIn),
    _validate_aboard(aboard),
    _validate_fatalities(fatalities),
    _validate_ground(ground),
    _validate_summary(summary),
  ])
    .then((values) => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
