// src/App.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import Visualization from "./Visualization.jsx"; // visualization component

// 🔹 Temporary fake data per floor (only used in About if needed later)
const floorData = [
  { floor: "1", devices: 8 },
  { floor: "2", devices: 12 },
  { floor: "4", devices: 5 },
  { floor: "5", devices: 10 },
  { floor: "6", devices: 15 },
  { floor: "7", devices: 9 },
  { floor: "8", devices: 4 },
];

// Total across all floors
const totalDevices = floorData.reduce((sum, row) => sum + row.devices, 0);

// Data for demo chart — not used anymore
const vizData = [
  ...floorData,
  { floor: "Total", devices: totalDevices },
];

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "home") {
      return (
        <section className="section home-section">
          <h1>Geisel Wi-Fi Occupancy Tracker</h1>
          <p>
            This project estimates how many devices are connected to Wi-Fi near
            ESP32 sensors placed throughout Geisel Library. The long-term goal
            is to give students a quick sense of which floors are crowded and
            which are open.
          </p>
        </section>
      );
    }

    if (page === "about") {
      return (
        <section className="section">
          <h1>About</h1>
          <p>
            ESP32 boards, programmed using the Arduino IDE, periodically scan
            for nearby Wi-Fi devices. Each board records:
          </p>
          <ul>
            <li>How many devices were detected</li>
            <li>Which floor the ESP32 is on</li>
            <li>The time of the scan</li>
          </ul>
          <p>
            These readings are sent to Firebase and visualized on the website.
            Live visualizations now appear on the{" "}
            <strong>Visualization</strong> page.
          </p>
        </section>
      );
    }

    if (page === "visualization") {
      return (
        <section className="section">
          <h1>Visualization</h1>
          <p>
            This visualization displays live data according to the Geisel
            Library floor layout. As data comes in, floor occupancy fills from
            the center, reflecting actual usage.
          </p>

          {/* Only visualization component shown here */}
          <div className="chart-container">
            <Visualization />
          </div>
        </section>
      );
    }

    if (page === "input") {
      return (
        <section className="section">
          <h1>Data Input (Demo)</h1>
          <p>
            In the final version of this project, readings will be sent
            automatically by ESP32 boards. This page demonstrates what manual
            input to Firebase might look like.
          </p>
          <form
            className="input-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo only: real input will use Firebase.");
            }}
          >
            <label>
              Floor:
              <select name="floor" required>
                <option value="">Select a floor</option>
                <option value="1">1st Floor</option>
                <option value="2">2nd Floor</option>
                <option value="4">4th Floor</option>
                <option value="5">5th Floor</option>
                <option value="6">6th Floor</option>
                <option value="7">7th Floor</option>
                <option value="8">8th Floor</option>
              </select>
            </label>

            <label>
              Number of devices:
              <input type="number" min="0" name="devices" required />
            </label>

            <button type="submit">Submit (Demo)</button>
          </form>
        </section>
      );
    }

    return null;
  };

  return (
    <div className="app">
      {/* Top navigation bar */}
      <nav className="navbar">
        <div className="navbar-title">Geisel Occupancy Tracker</div>
        <div className="navbar-links">
          <button
            className={page === "home" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("home")}
          >
            Home
          </button>
          <button
            className={page === "about" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("about")}
          >
            About
          </button>
          <button
            className={page === "visualization" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("visualization")}
          >
            Visualization
          </button>
          <button
            className={page === "input" ? "nav-link active" : "nav-link"}
            onClick={() => setPage("input")}
          >
            Data Input
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="main">{renderPage()}</main>

      {/* Footer */}
      <footer className="footer">
        ESP32 Wi-Fi Occupancy • DS3 Geisel Library Project
      </footer>
    </div>
  );
}

export default App;
