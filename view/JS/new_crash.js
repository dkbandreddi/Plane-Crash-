const date = document.getElementById("date");
const time = document.getElementById("time");
const city = document.getElementById("city");
const country = document.getElementById("country");
const operator = document.getElementById("operator");
const flightNo = document.getElementById("flightNo");
const route = document.getElementById("route");
const aircraftType = document.getElementById("aircraftType");
const registration = document.getElementById("registration");
const cnIn = document.getElementById("cnIn");
const aboard = document.getElementById("aboard");
const fatalities = document.getElementById("fatalities");
const ground = document.getElementById("ground");
const summary = document.getElementById("summary");

async function createNewCrash(e) {
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

  console.log(obj);

  fetch("/crashes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((data) => {
      table_div.innerHTML = data.msg;
    });
}
