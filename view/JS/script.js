const years_div = document.getElementById("years");
const country_div = document.getElementById("countries")
const crashes = document.getElementById("crashes");
// we fetch the api endpoint to get the distinct years and add them into the years_div element.
fetch("/crashes/years")
  .then((response) => response.json())
  .then((data) => {
    const years = data.years;
    years.forEach((year) => {
      const a = document.createElement("a");
      a.text = year;
      a.setAttribute("href", "#");
      a.setAttribute("class", "p-1");
      a.setAttribute("id", "year");
      a.setAttribute("onClick", "getYearInfo()");
      years_div.appendChild(a);
    });
  });
  // we fetch the api endpoint to get the distinct countries and add them into the country_div element.
  fetch("/crashes/countries")
  .then((response) => response.json())
  .then((data) => {
    const countries = data.country;
    countries.forEach((country) => {
      const a = document.createElement("a");
      a.text = country.toUpperCase();
      a.setAttribute("href", "#");
      a.setAttribute("class", "p-1");
      a.setAttribute("id", "country");
      a.setAttribute("onClick", "getCountryInfo()");
      country_div.appendChild(a);
    });
  });
const table = document.createElement("table");
const thead = document.createElement("thead");
const theadRow = document.createElement("tr");
const tbody = document.createElement("tbody");
const tableHeaders = ["Date", "City", "Country", "Aircraft Type"];
tableHeaders.forEach((header) => {
  let th = document.createElement("th");
  th.innerHTML = header;
  theadRow.append(th);
});
thead.append(theadRow);
table.append(thead);
table.append(tbody);
table.setAttribute("class", "table table-dark");
crashes.append(table);
// This function is used to get data from the database aggregated by year.
async function getYearInfo(e) {
  e = e || window.event;
  const clicked_year = e.target.text;
  fetch(`/crashes/year/${clicked_year}`)
  .then((response) => response.json())
    .then((data) => {
      tbody.innerHTML = "";
      data.forEach((crash) => {
        const row = document.createElement("tr");
        const date = document.createElement("td");
        const city = document.createElement("td");
        const country = document.createElement("td");
        const aircraftType = document.createElement("td");

        const a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("onclick", "getCrashInfo()");
        a.setAttribute("id", crash._id);
        a.setAttribute("class", "link-light");
        a.text = `${crash.day}/${crash.month}/${crash.year}`;
        date.appendChild(a);
        city.innerText = crash.city.toUpperCase();
        country.innerText = crash.country.toUpperCase();
        aircraftType.innerText = crash.aircraftType.toUpperCase();

        row.append(date, city, country, aircraftType);
        tbody.append(row);
        table.append(tbody);
      });
    });
}
// This function is used to get data from the database aggregated by country.
async function getCountryInfo(e) {
  e = e || window.event;
  const clicked_year = e.target.text;
  fetch(`/crashes/country/${clicked_year}`)
  .then((response) => response.json())
    .then((data) => {
      tbody.innerHTML = "";
      data.forEach((crash) => {
        const row = document.createElement("tr");
        const date = document.createElement("td");
        const city = document.createElement("td");
        const country = document.createElement("td");
        const aircraftType = document.createElement("td");

        const a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("onclick", "getCrashInfo()");
        a.setAttribute("id", crash._id);
        a.setAttribute("class", "link-light");
        a.text = `${crash.day}/${crash.month}/${crash.year}`;
        date.appendChild(a);
        city.innerText = crash.city.toUpperCase();
        country.innerText = crash.country.toUpperCase();
        aircraftType.innerText = crash.aircraftType.toUpperCase();

        row.append(date, city, country, aircraftType);
        tbody.append(row);
        table.append(tbody);
      });
    });
}

async function getCrashInfo(e) {
  e = e || window.event;
  const crash_id = e.target.id;
  window.open(`http://localhost:8080/crash?id=${crash_id}`, "_blank").focus();
}
// we fetch the api endpoint to get the x and y cor-ordinates to construct the yearly fatalities graph .
fetch("/crashes/graph/yearly-fatalities-graph").then((response) => {
  response.json().then((data) => {
    const x = data.plot[0].x;
    const y = data.plot[0].y;
    let graph = [
      {
        x: x,
        y: y,
        type: "bar",
      },
    ];
    Plotly.newPlot("fatalities-plot", graph);
  });
});
// we fetch the api endpoint to get the x and y cor-ordinates to construct the yearly crashes graph .
fetch("/crashes/graph/yearly-crashes-graph").then((response) => {
  response.json().then((data) => {
    const x = data.plot[0].x;
    const y = data.plot[0].y;
    let graph = [
      {
        x: x,
        y: y,
        type: "bar",
      },
    ];
    Plotly.newPlot("crash-plot", graph);
  });
});
