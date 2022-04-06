const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const crash_id = urlParams.get("id");

const date = document.getElementById("date");
const loc = document.getElementById("location");
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
    const full_date = `${crash.day}/${crash.month}/${crash.year}`;
    const full_location = `${crash.city.toUpperCase()}, ${crash.country.toUpperCase()}`;
    date.innerText = full_date;
    loc.innerText = full_location;
    time.innerText = crash.time;
    operator.innerText = crash.operator;
    flightNo.innerText = crash.flightNo ? crash.flightNo : "-";
    route.innerText = crash.route;
    aircraftType.innerText = crash.aircraftType;
    registration.innerText = crash.registration;
    aboard.innerText = crash.aboard;
    fatalities.innerText = crash.fatalities;
    ground.innerText = crash.ground;
    summary.innerText = crash.summary;
    cnIn.innerText = crash.cnIn;
  });

async function deleteCrashInfo() {
  const table_div = document.getElementById("table");
  fetch(`/crashes/${crash_id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      table_div.innerHTML = data.msg;
    });
}

const update_link = document.getElementById("update");
update_link.setAttribute("href", `./update_event.html?id=${crash_id}`);
