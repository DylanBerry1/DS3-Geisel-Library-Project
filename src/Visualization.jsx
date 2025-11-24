// src/Visualization.jsx
import { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { ref, onValue } from "firebase/database";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const FLOOR_ORDER = ["1", "2", "4", "5", "6", "7", "8"];

// Full capacity for each floor (people)
const FLOOR_CAPACITY = {
  "1": 865,
  "2": 1080,
  "4": 80,
  "5": 155,
  "6": 440,
  "7": 195,
  "8": 165,
};

function Visualization() {
  const [floorsSnapshot, setFloorsSnapshot] = useState(
    FLOOR_ORDER.map(() => null)
  );
  const [timeline, setTimeline] = useState([]); // total devices over time
  const [floorTimelines, setFloorTimelines] = useState({}); // per-floor series
  const [hoverFloor, setHoverFloor] = useState(null); // which floor is hovered

  useEffect(() => {
    const readingsRef = ref(db, "readings");

    const unsub = onValue(
      readingsRef,
      (snap) => {
        const val = snap.val();
        if (!val) {
          setFloorsSnapshot(FLOOR_ORDER.map(() => null));
          setTimeline([]);
          setFloorTimelines({});
          return;
        }

        const entries = Object.values(val).filter(
          (item) =>
            item &&
            typeof item.count === "number" &&
            typeof item.timestamp === "number"
        );
        if (!entries.length) {
          setFloorsSnapshot(FLOOR_ORDER.map(() => null));
          setTimeline([]);
          setFloorTimelines({});
          return;
        }

        // ---------- GROUP BY TIMESTAMP ----------
        // For each timestamp, collect counts per floor.
        const groupedByTs = new Map();
        for (const item of entries) {
          const ts = item.timestamp;
          const floorId = item.floor ? String(item.floor) : null;
          if (!floorId) continue;

          let bucket = groupedByTs.get(ts);
          if (!bucket) {
            bucket = { timestamp: ts, perFloor: {} };
            groupedByTs.set(ts, bucket);
          }

          // If multiple readings for same floor+timestamp, last one wins.
          bucket.perFloor[floorId] = item.count;
        }

        const groupedArr = Array.from(groupedByTs.values()).sort(
          (a, b) => a.timestamp - b.timestamp
        );

        const totalTimeline = [];
        const perFloorObj = {};

        for (const g of groupedArr) {
          const timeLabel = new Date(g.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          // total at this timestamp = sum of counts for all floors at this timestamp
          const totalNow = Object.values(g.perFloor).reduce(
            (sum, c) => sum + c,
            0
          );
          totalTimeline.push({
            time: timeLabel,
            count: totalNow,
          });

          // per-floor points, only where there is actual data
          for (const [floorId, count] of Object.entries(g.perFloor)) {
            if (!perFloorObj[floorId]) perFloorObj[floorId] = [];
            perFloorObj[floorId].push({
              time: timeLabel,
              count,
            });
          }
        }

        setTimeline(totalTimeline);
        setFloorTimelines(perFloorObj);

        // ---------- Latest snapshot per floor (for bar fill) ----------
        const floorsMap = new Map();
        for (const item of entries) {
          if (!item.floor) continue;
          const floorId = String(item.floor);
          const prev = floorsMap.get(floorId);
          if (!prev || item.timestamp > prev.timestamp) {
            floorsMap.set(floorId, item);
          }
        }

        const floorArray = FLOOR_ORDER.map((f) => floorsMap.get(f) || null);
        setFloorsSnapshot(floorArray);
      },
      (err) => {
        console.error("Firebase error:", err);
      }
    );

    return () => unsub();
  }, []);

  // Current total devices (for bottom text)
  const totalCount = floorsSnapshot.reduce(
    (sum, f) => sum + (f ? f.count : 0),
    0
  );

  // Visual width scaling for each floor (x)
  const widthMultiplierForFloor = (floor) => {
    if (floor === "6") return 12;
    if (floor === "5" || floor === "7") return 10;
    if (floor === "2") return 14;
    if (floor === "1") return 10;
    return 8; // 4 and 8
  };

  const getFloorData = (floor) => {
    const idx = FLOOR_ORDER.indexOf(floor);
    if (idx === -1) return null;
    return floorsSnapshot[idx];
  };

  // DOM order bottom → top (CSS uses column-reverse to render visually)
  const rowsBottomToTop = [
    { kind: "floor", floor: "1" },

    { kind: "floor", floor: "2" },
    {
      kind: "connector",
      id: "between-4-2",
      widthMult: 8.2,
      heightMult: 1.2,
    },

    { kind: "floor", floor: "4" },
    {
      kind: "connector",
      id: "between-5-4",
      widthMult: 10.2,
      heightMult: 0.2,
    },

    { kind: "floor", floor: "5" },
    {
      kind: "connector",
      id: "between-6-5",
      widthMult: 12.2,
      heightMult: 0.2,
    },

    { kind: "floor", floor: "6" },
    {
      kind: "connector",
      id: "between-7-6",
      widthMult: 12.2,
      heightMult: 0.2,
    },

    { kind: "floor", floor: "7" },
    {
      kind: "connector",
      id: "between-8-7",
      widthMult: 10.2,
      heightMult: 0.2,
    },

    { kind: "floor", floor: "8" },
    {
      kind: "connector",
      id: "above-8",
      widthMult: 8.2,
      heightMult: 0.2,
    },
  ];

  // Chart behavior:
  // - default (no hover) → totalTimeline
  // - hover on a floor → that floor's series (if it exists)
  const chartBase =
    hoverFloor && floorTimelines[hoverFloor]?.length
      ? floorTimelines[hoverFloor]
      : timeline;

  // Always show only latest 20 datapoints
  const chartDataLimited = chartBase.slice(-20);

  return (
    <div id="geiselViz">
      <div className="geisel-wrap">
        {/* LEFT: Geisel stacked floors */}
        <div className="geisel-pyramid">
          {rowsBottomToTop.map((row) => {
            if (row.kind === "connector") {
              const isBetweenFourAndTwo = row.id === "between-4-2";

              return (
                <div key={row.id} className="connector-row">
                  <div
                    className={`connector-bar connector-${row.id}`}
                    style={{
                      "--width-mult": row.widthMult,
                      "--height-mult": row.heightMult,
                    }}
                  >
                    {isBetweenFourAndTwo ? (
                      <>
                        {/* left 0.2x segment, middle 4x, right 0.2x */}
                        <div className="connector-4-2-segment connector-4-2-segment-left" />
                        <div className="connector-4-2-segment connector-4-2-segment-middle" />
                        <div className="connector-4-2-segment connector-4-2-segment-right" />

                        {/* slanted columns (parallelograms) */}
                        <div className="slanted-column slanted-column-left" />
                        <div className="slanted-column slanted-column-right" />
                      </>
                    ) : null}
                  </div>
                </div>
              );
            }

            // Floor rows
            const floor = row.floor;
            const data = getFloorData(floor);
            const count = data ? data.count : 0;

            const capacity = FLOOR_CAPACITY[floor] || null;
            let fillPercent = 0;
            if (capacity && capacity > 0) {
              fillPercent = Math.min(100, (count / capacity) * 100);
            }

            return (
              <div
                key={`floor-${floor}`}
                className={`floor-row floor-${floor}`}
              >
                <span className="floor-label">Floor {floor}</span>

                <div
                  className="floor-bar-wrapper"
                  data-tooltip={`Floor ${floor}: ${count} people`}
                  onMouseEnter={() => setHoverFloor(floor)}
                  onMouseLeave={() => setHoverFloor(null)}
                >
                  <div
                    className="floor-bar"
                    style={{
                      "--width-mult": widthMultiplierForFloor(floor),
                      "--fill-percent": `${fillPercent}%`,
                    }}
                  >
                    <div
                      className={"fill" + (count === 0 ? " fill-empty" : "")}
                    />
                  </div>
                </div>

                <span className="floor-count">
                  {count > 0 ? count : "--"}
                </span>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Devices Over Time */}
        <div className="timeline-box">
          <h3>Devices Over Time</h3>
          {chartDataLimited.length > 0 ? (
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={chartDataLimited}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4fa3ff"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="waiting-text">Waiting for readings…</p>
          )}
        </div>
      </div>

      <p className="geisel-total">
        Total devices currently detected in Geisel:{" "}
        <strong>{totalCount}</strong>
      </p>
    </div>
  );
}

export default Visualization;
