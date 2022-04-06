const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const crash_id = urlParams.get("id");

const date = document.getElementById("date");
const city = document.getElementById("city");
const country = document.getElementById("country");
const time = document.getElementById("time");
const operator = document.getElementById("operator");
const flightNo = document.getElementById("flightNo");
const route = document.getElementById("route");
const aircraftType = document.getElementById("aircraftType");
const registration = document.getElementById("registration");
const aboard = document.getElementById("aboard");
const fatalities = document.getElementById("fatalities");
const ground = document.getElementById("ground");
const summary = document.getElementById("summary");
const cnIn = document.getElementById("cnIn");

fetch(`/crashes/${crash_id}`)
  .then((response) => response.json())
  .then((crash) => {
    const full_date = `${crash.year}-${crash.month}-${crash.day}`;
    date.value = full_date;
    city.value = crash.city;
    country.value = crash.country;
    time.value = crash.time;
    operator.value = crash.operator;
    flightNo.value = crash.flightNo ? crash.flightNo : "-";
    route.value = crash.route;
    aircraftType.value = crash.aircraftType;
    registration.value = crash.registration;
    aboard.value = crash.aboard;
    fatalities.value = crash.fatalities;
    ground.value = crash.ground;
    summary.value = crash.summary;
    cnIn.value = crash.cnIn;
  });

async function updateCrash(e) {
  e = e || window.event;
  e.preventDefault();
  const split_date = date.value.split("-");
  const obj = {
    year: split_date[0],
    month: split_date[1],
    day: split_date[2],
    time: time.value,
    city: city.value,
    country: country.value,
    operator: operator.value,
    flightNo: flightNo.value,
    route: route.value,
    aircraftType: aircraftType.value,
    registration: registration.value,
    cnIn: cnIn.value,
    aboard: aboard.value,
    fatalities: fatalities.value,
    ground: ground.value,
    summary: summary.value,
  };

  fetch(`/crashes/${crash_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => {
      location.replace(`http://localhost:8080/crash?id=${crash_id}`);
    });
}
