# Plane Crash Information Database & Visualization

## Project Overview

This project provides a web application for viewing, managing, and visualizing plane crash data. Users can browse historical crash records, filter them by various criteria, view details of specific incidents, and see crashes plotted on an interactive map. The application also supports CRUD (Create, Read, Update, Delete) operations for managing the crash database.

## User Interface

The user interface is built using modern web technologies, including HTML, vanilla JavaScript, and is styled with Tailwind CSS for a responsive and clean design.

Key pages in the application include:

*   **Main Page (`index.html`):** Displays crash data using a card-based layout, an interactive map showing crash locations, quick filters for year and country, and an advanced search panel. It also features Plotly.js charts for yearly crash counts and fatalities.
    *   `[Screenshot of Main Page with Map, Cards, and Filters]`
*   **Crash Detail Page (`crash.html`):** Shows comprehensive information for a single crash event. Users can navigate to update or delete the record from this page.
*   **Create Event Page (`create_event.html`):** A form to add new crash records to the database.
*   **Update Event Page (`update_event.html`):** A form, pre-filled with existing data, to modify a crash record.

## Features

*   **View Crash Data:** Browse a collection of plane crash records.
*   **CRUD Operations:** Full capabilities to Create, Read, Update, and Delete crash records.
*   **Filtering & Search:**
    *   Quick filters by Year and Country.
    *   Advanced search by date range, aircraft type, and operator.
    *   `[Screenshot of Advanced Search Filters]`
*   **Interactive Map:** Crash locations are plotted on an interactive Leaflet.js map, dynamically updating with filter results.
    *   `[Screenshot of Interactive Map with Markers]`
*   **Responsive Design:** The UI is designed to adapt to various screen sizes, providing a good user experience on desktops, tablets, and mobile devices.
*   **Data Visualizations:** Includes Plotly.js charts showing yearly crash counts and fatalities.

## Key Technologies/Dependencies (Client-Side)

The client-side of this application relies on the following technologies:

*   **HTML5:** For structuring the web pages.
*   **CSS3 (Tailwind CSS):** For modern styling and responsive design, utilized via CDN.
*   **JavaScript (ES6+):** For client-side interactivity, data fetching, and DOM manipulation.
*   **Leaflet.js:** For the interactive map feature, included via CDN.
*   **Plotly.js:** For generating charts and graphs, included via CDN.

## Setup and Running the Application

(This section typically includes backend setup if applicable. Assuming a Node.js backend based on common project structures.)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    - Ensure a `.env` file is configured with necessary variables like database connection strings (e.g., MongoDB URI). Refer to a `.env.example` if provided.
4.  **Run the application (backend):**
    ```bash
    npm start
    ```
5.  **Access the application:**
    - Open your web browser and navigate to `http://localhost:<PORT>` (e.g., `http://localhost:8080` if that's the configured port for the backend server which serves the frontend).

The frontend dependencies (Tailwind CSS, Leaflet.js, Plotly.js) are loaded via CDNs, so no additional frontend build steps are required.

## Contributing

(Placeholder for contribution guidelines if this were an open project)
We welcome contributions! Please see `CONTRIBUTING.md` for more details (if such a file exists).

## License

(Placeholder for license information)
This project is licensed under the MIT License - see the `LICENSE.md` file for details (if such a file exists).
