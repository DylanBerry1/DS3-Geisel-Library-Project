// src/DataInput.jsx
import { useState } from "react";
import { db } from "./firebase.js";
import { ref, push } from "firebase/database";

function DataInput() {
  const [count, setCount] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const parsed = parseInt(count, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setStatus("error");
      return;
    }

    try {
      const readingsRef = ref(db, "readings");
      await push(readingsRef, {
        count: parsed,
        timestamp: Date.now(), // current time in ms
      });
      setStatus("success");
      setCount("");
    } catch (err) {
      console.error("Error writing to Firebase:", err);
      setStatus("error");
    }
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <label>
        Number of devices:
        <input
          type="number"
          min="0"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          required
        />
      </label>

      <button type="submit">Submit Reading</button>

      {status === "success" && (
        <p className="status success">
          ✅ Reading submitted! Check the Visualization page.
        </p>
      )}
      {status === "error" && (
        <p className="status error">
          ❌ There was a problem. Make sure the count is a non-negative number
          and Firebase is configured correctly.
        </p>
      )}

      <p className="input-note">
        In the real system, your ESP32 boards will send readings automatically.
        This form is mainly for testing and manual input.
      </p>
    </form>
  );
}

export default DataInput;
