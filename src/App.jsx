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

// 🔹 Temporary fake data per floor (we'll replace with Firebase data later)
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

// Data for the bar chart: all floors + total
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
          <p>
            <ul>
              <li>How many devices were detected</li>
              <li>Which floor the ESP32 is on</li>
              <li>The time of the scan</li>
            </ul>
          </p>
          <p>
            These readings are sent to an online database (Firebase) and are
            visualized on this site. What you see now uses example data; later,
            it will be driven by real readings from the deployed sensors.
          </p>
        </section>
      );
    }

    if (page === "visualization") {
      return (
        <section className="section">
          <h1>Visualization</h1>
          <p>
            Bar chart of <strong>number of devices per floor</strong> in Geisel.
            The last bar shows the <strong>total</strong> across all floors.
            This currently uses placeholder data but is wired for live data
            later.
          </p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={vizData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="floor"
                  label={{
                    value: "Floor",
                    position: "insideBottomRight",
                    offset: -5,
                    fill: "#E5E7EB",
                  }}
                  tick={{ fill: "#E5E7EB" }}
                />
                <YAxis
                  label={{
                    value: "Devices",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#E5E7EB",
                  }}
                  tick={{ fill: "#E5E7EB" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(148,163,184,0.6)",
                    borderRadius: "0.5rem",
                    color: "#E5E7EB",
                  }}
                />
                <Legend
                  wrapperStyle={{ color: "#E5E7EB", fontSize: "0.8rem" }}
                />

                {/* 🔵 New blue→blue gradient */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" /> {/* light blue */}
                    <stop offset="100%" stopColor="#2563eb" /> {/* deep blue */}
                  </linearGradient>
                </defs>

                <Bar
                  dataKey="devices"
                  name="Devices"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
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
            automatically by ESP32 boards. This page is for testing what manual
            input to the database would look like.
          </p>
          <form
            className="input-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                "Demo only: in the real system this will send data to Firebase."
              );
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

            <button type="submit">Submit (demo)</button>
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
