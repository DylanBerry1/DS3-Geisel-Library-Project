// src/Visualization.jsx
import { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { ref, onValue, off } from "firebase/database";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Visualization() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Listen to data at /readings in the Realtime Database
    const readingsRef = ref(db, "readings");

    const unsubscribe = onValue(
      readingsRef,
      (snapshot) => {
        const val = snapshot.val();

        if (!val) {
          setData([]);
          return;
        }

        // val is an object like { id1: {...}, id2: {...} }
        const points = Object.values(val)
          .filter(
            (item) =>
              item &&
              typeof item.count === "number" &&
              typeof item.timestamp === "number"
          )
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            count: item.count,
          }));

        setData(points);
      },
      (error) => {
        console.error("Error reading data from Firebase:", error);
      }
    );

    // Cleanup listener when component unmounts
    return () => {
      off(readingsRef);
    };
  }, []);

  const hasData = data.length > 0;

  return (
    <div className="viz-container">
      {!hasData && (
        <p className="viz-empty">
          No data found yet. Once Firebase is configured and readings are
          written to <code>/readings</code>, the line chart will appear here.
        </p>
      )}

      {hasData && (
        <div className="viz-chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#0077cc"
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Visualization;
