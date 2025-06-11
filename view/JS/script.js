const years_div = document.getElementById("years");
const country_div = document.getElementById("countries")
const crashes = document.getElementById("crashes");

// Map variables
let map;
let markersLayer;

// DOM Elements for Advanced Search
const filterStartDate = document.getElementById("filterStartDate");
const filterEndDate = document.getElementById("filterEndDate");
const filterAircraftType = document.getElementById("filterAircraftType");
const filterOperator = document.getElementById("filterOperator");
const searchButton = document.getElementById("searchButton");
const clearFiltersButton = document.getElementById("clearFiltersButton");

// Helper function to clear advanced filter input fields
function clearAdvancedFilters() {
    if (filterStartDate) filterStartDate.value = "";
    if (filterEndDate) filterEndDate.value = "";
    if (filterAircraftType) filterAircraftType.value = "";
    if (filterOperator) filterOperator.value = "";
}

// Refactored card creation function
function createCrashCard(crash) {
    const card = document.createElement("div");
    card.className = "bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col"; // Added flex

    const contentWrapper = document.createElement("div"); // Wrapper for text content
    contentWrapper.className = "flex-grow";

    const dateLink = document.createElement("a");
    dateLink.href = `/crash?id=${crash._id}`;
    dateLink.target = "_blank";
    dateLink.className = "text-lg font-semibold text-blue-600 hover:underline mb-2 block";

    const day = crash.day ? String(crash.day).padStart(2, '0') : 'N/A';
    const month = crash.month ? String(crash.month).padStart(2, '0') : 'N/A';
    const year = crash.year || 'N/A';
    dateLink.textContent = `${day}/${month}/${year}`;
    contentWrapper.appendChild(dateLink);

    const cityP = document.createElement("p");
    cityP.className = "text-sm text-gray-700 mb-1";
    cityP.innerHTML = `<strong>City:</strong> ${crash.city ? crash.city.toUpperCase() : 'N/A'}`;
    contentWrapper.appendChild(cityP);

    const countryP = document.createElement("p");
    countryP.className = "text-sm text-gray-700 mb-1";
    countryP.innerHTML = `<strong>Country:</strong> ${crash.country ? crash.country.toUpperCase() : 'N/A'}`;
    contentWrapper.appendChild(countryP);

    const aircraftP = document.createElement("p");
    aircraftP.className = "text-sm text-gray-700"; // Removed mb-1 if it's the last item
    aircraftP.innerHTML = `<strong>Aircraft:</strong> ${crash.aircraftType ? crash.aircraftType.toUpperCase() : 'N/A'}`;
    contentWrapper.appendChild(aircraftP);

    card.appendChild(contentWrapper);
    return card;
}

function initializeMap() {
    if (document.getElementById('mapContainer')) {
        map = L.map('mapContainer').setView([20, 0], 2); // Centered globally
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(map);
        markersLayer = L.layerGroup().addTo(map);
    }
}

function updateMapMarkers(crashesData) {
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    let validCoordsCount = 0;

    crashesData.forEach(crash => {
        // Assuming crash data has 'latitude' and 'longitude' properties.
        // Make sure these are numbers. The actual property names might differ.
        const lat = parseFloat(crash.latitude);
        const lon = parseFloat(crash.longitude);

        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            const marker = L.marker([lat, lon]);

            const day = crash.day ? String(crash.day).padStart(2, '0') : 'N/A';
            const month = crash.month ? String(crash.month).padStart(2, '0') : 'N/A';
            const year = crash.year || 'N/A';
            const dateStr = `${day}/${month}/${year}`;
            const cityStr = crash.city ? crash.city.toUpperCase() : 'N/A';
            const countryStr = crash.country ? crash.country.toUpperCase() : 'N/A';
            const aircraftStr = crash.aircraftType ? crash.aircraftType.toUpperCase() : 'N/A';

            marker.bindPopup(
                `<b>Date:</b> ${dateStr}<br>` +
                `<b>Location:</b> ${cityStr}, ${countryStr}<br>` +
                `<b>Aircraft:</b> ${aircraftStr}<br>` +
                `<a href="/crash?id=${crash._id}" target="_blank" class="text-blue-500 hover:underline">More Details</a>`
            );
            markersLayer.addLayer(marker);
            validCoordsCount++;
        }
    });

    // Optional: Adjust map view based on markers
    // if (validCoordsCount > 0 && markersLayer.getLayers().length > 0) {
    //    map.fitBounds(markersLayer.getBounds(), { padding: [50, 50], maxZoom: 10 });
    // } else if (map) { // Ensure map is initialized
    //    map.setView([20,0], 2); // Reset to default view if no markers
    // }
}


// Fetch distinct years
fetch("/crashes/years")
  .then((response) => response.json())
  .then((data) => {
    const years = data.years;
    if (years_div) { // Check if years_div exists
        years.forEach((year) => {
            const a = document.createElement("a");
            a.text = year;
            a.setAttribute("href", "#");
            a.setAttribute("class", "p-1 hover:text-blue-600 hover:underline"); // Added hover style
            a.setAttribute("id", "year"); // Note: duplicate IDs are not ideal. Consider class or data-attribute.
            a.addEventListener("click", getYearInfo); // Changed to addEventListener
            years_div.appendChild(a);
        });
    }
  });

// Fetch distinct countries
fetch("/crashes/countries")
  .then((response) => response.json())
  .then((data) => {
    const countries = data.country;
    if (country_div) { // Check if country_div exists
        countries.forEach((country) => {
            const a = document.createElement("a");
            a.text = country.toUpperCase();
            a.setAttribute("href", "#");
            a.setAttribute("class", "p-1 hover:text-blue-600 hover:underline"); // Added hover style
            a.setAttribute("id", "country"); // Note: duplicate IDs are not ideal.
            a.addEventListener("click", getCountryInfo); // Changed to addEventListener
            country_div.appendChild(a);
        });
    }
  });

// Event listener for "Clear Filters" button
if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        clearAdvancedFilters();
        // Optionally clear results or load default:
        // crashes.innerHTML = '<p class="text-center text-gray-500 col-span-full">Filters cleared. Select criteria and search.</p>';
    });
}

// Event listener for "Search" button
if (searchButton) {
    searchButton.addEventListener("click", async () => {
        const params = new URLSearchParams();
        if (filterStartDate.value) params.append("startDate", filterStartDate.value);
        if (filterEndDate.value) params.append("endDate", filterEndDate.value);
        if (filterAircraftType.value.trim()) params.append("aircraftType", filterAircraftType.value.trim());
        if (filterOperator.value.trim()) params.append("operator", filterOperator.value.trim());

        // Indicate that year/country filters are not primary for this view
        // (e.g., remove active styling from year/country links if implemented)

        try {
            const response = await fetch(`/crashes/filter?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            crashes.innerHTML = "";
            if (data.length === 0) {
                crashes.innerHTML = '<p class="text-center text-gray-500 col-span-full">No results found for your criteria.</p>';
                updateMapMarkers([]); // Clear map if no results
                return;
            }
            data.forEach(crash => {
                const card = createCrashCard(crash);
                crashes.appendChild(card);
            });
            updateMapMarkers(data); // Update map with new data
        } catch (error) {
            console.error("Error fetching filtered crash data:", error);
            updateMapMarkers([]); // Clear map on error
            crashes.innerHTML = '<p class="text-center text-red-500 col-span-full">Error loading search results. Please try again.</p>';
        }
    });
}

// Get data by year
async function getYearInfo(e) {
  e.preventDefault(); // Prevent default anchor behavior
  clearAdvancedFilters(); // Clear advanced search fields
  const clicked_year = e.target.text;
  try {
    const response = await fetch(`/crashes/year/${clicked_year}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    crashes.innerHTML = "";
    if (data.length === 0) {
      crashes.innerHTML = '<p class="text-center text-gray-500 col-span-full">No crash data found for this year.</p>';
      updateMapMarkers([]); // Clear map
      return;
    }
    data.forEach(crash => {
      const card = createCrashCard(crash);
      crashes.appendChild(card);
    });
    updateMapMarkers(data); // Update map
  } catch (error) {
    console.error(`Error fetching data for year ${clicked_year}:`, error);
    updateMapMarkers([]); // Clear map on error
    crashes.innerHTML = '<p class="text-center text-red-500 col-span-full">Error loading data. Please try again.</p>';
  }
}

// Get data by country
async function getCountryInfo(e) {
  e.preventDefault(); // Prevent default anchor behavior
  clearAdvancedFilters(); // Clear advanced search fields
  const clicked_country = e.target.text;
  try {
    const response = await fetch(`/crashes/country/${clicked_country}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    crashes.innerHTML = "";
    if (data.length === 0) {
      crashes.innerHTML = '<p class="text-center text-gray-500 col-span-full">No crash data found for this country.</p>';
      updateMapMarkers([]); // Clear map
      return;
    }
    data.forEach(crash => {
      const card = createCrashCard(crash);
      crashes.appendChild(card);
    });
    updateMapMarkers(data); // Update map
  } catch (error) {
    console.error(`Error fetching data for country ${clicked_country}:`, error);
    updateMapMarkers([]); // Clear map on error
    crashes.innerHTML = '<p class="text-center text-red-500 col-span-full">Error loading data. Please try again.</p>';
  }
}

// This function can be kept if other parts of the application use it
// or if we want to revert to JS-based navigation for cards later.
// For now, direct links are used on cards.
async function getCrashInfo(e) {
  e = e || window.event;
  const crash_id = e.target.id; // This would require the clickable element to have the crash_id as its id
  window.open(`/crash?id=${crash_id}`, "_blank").focus(); // Relative path, assuming same domain
}

// Initialize the map when the script loads
initializeMap();

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
