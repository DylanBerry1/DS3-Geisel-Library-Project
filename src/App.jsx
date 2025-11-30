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

const floorData = [
  { floor: "1", devices: 8 },
  { floor: "2", devices: 12 },
  { floor: "4", devices: 5 },
  { floor: "5", devices: 10 },
  { floor: "6", devices: 15 },
  { floor: "7", devices: 9 },
  { floor: "8", devices: 4 },
];

const totalDevices = floorData.reduce((sum, row) => sum + row.devices, 0);

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "home") {
      return (
        <>
          {/* First card */}
          <section className="section home-section" style={{ marginBottom: "1.5rem" }}>
            <h1>Geisel Occupancy Tracker</h1>
            <p>
              This project estimates how many people are present near ESP32
              sensors placed throughout Geisel Library. The ESP32 boards scan
              for nearby Bluetooth devices and use hashing to approximate unique
              visitors, so students can quickly see which floors are crowded and
              which are open.
            </p>
          </section>

          {/* Second card with links and improved spacing */}
          <section className="section" style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ marginBottom: "1rem" }}>Project Links</h1>
            <p style={{ marginBottom: "0.75rem" }}>
              Explore the live backend data and source code for this project:
            </p>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "1.2rem",
                marginBottom: "0.85rem",
                lineHeight: "1.6",
              }}
            >
              <li>
                <a
                  href="https://console.firebase.google.com/u/2/project/geiseloccupancytracker-4429e/overview?pli=1"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#FCD34D" }}
                >
                  Firebase Console — GeiselOccupancyTracker
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/DylanBerry1/DS3-Geisel-Library-Project"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#FCD34D" }}
                >
                  GitHub Repository — DS3 Geisel Library Project
                </a>
              </li>
            </ul>
          </section>
        </>
      );
    }

    if (page === "about") {
      return (
        <section className="section">
          <h1 style={{ marginBottom: "1rem" }}>About</h1>
          <p style={{ marginBottom: "0.75rem" }}>
            ESP32 boards, programmed using the Arduino IDE, periodically scan
            for nearby Bluetooth devices. For each scan, the code hashes device
            identifiers so that individual devices are de-duplicated. Each
            board estimates:
          </p>
          <ul
            style={{
              marginLeft: "1.2rem",
              marginBottom: "0.85rem",
              lineHeight: "1.6",
            }}
          >
            <li>How many unique Bluetooth devices were detected</li>
            <li>Which floor the device is on</li>
            <li>The time of the scan</li>
          </ul>
          <p style={{ marginTop: "0.25rem" }}>
            These readings are sent to Firebase and visualized on the website.
            Live visualizations now appear on the <strong>Visualization</strong> page.
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

      <main className="main">{renderPage()}</main>

      <footer className="footer">
        ESP32 Bluetooth Occupancy • DS3 Geisel Library Project
      </footer>
    </div>
  );
}

export default App;
