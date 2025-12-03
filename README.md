**Geisel Occupancy Tracker Website**

* **Overview**  
  - The website is a React-based real-time visualization dashboard that displays live occupancy data of various floors in the Geisel Library. Data is provided by ESP32 Bluetooth scanning devices, stored in Firebase Realtime Database, and streamed to the website via persistent listeners. The visualization mimics Geisel’s architectural layout using responsive scaling, fill animations, connector bars, and structural support columns.  
* **How the Website Works**  
  ESP32 Bluetooth Scan → Firebase Realtime Database → Website (React) → Real-Time Visualization  
  - ESP32 scans nearby devices and sends their count to Firebase with floor ID and timestamp.  
  - The website uses a Firebase listener (onValue) to continuously retrieve updated readings.  
  - The most recent reading for each floor is identified and used to update bar visualization.  
  - Historical readings are grouped by timestamp and processed into:  
    * An overall timeline of total occupancy.  
    * Individual timelines per floor (only shown on hover).  
  - Website UI updates automatically without any manual refresh.  
* **How to Use the Website**

| Feature | Instructions |
| :---- | :---- |
| Navigate between pages | Use the top navigation bar (Home/ About/ Visualization/ Data Input) |
| View real-time data | Go to the Visualization page |
| Hover over a floor bar | Timeline chart switches to show that floor’s occupancy trend |
| Move mouse away | Timeline chart returns to total occupancy trend |
| Read current occupancy | Each floor’s bar shows a numeric value on the right side |
| Monitor overall occupancy | The total count is displayed below the visualization |
| Input testing values | The Data Input page is for demo only, not connected to Firebase |

* Website Page Components

| Component | Function |
| :---- | :---- |
| App.jsx | Handles navigation and renders page content |
| Visualization.jsx | Displays floor visualization and timeline chart |
| DataInput.jsx | Demo-only input form, not connected to Firebase |
| index.css & App.css | Styling for UI and visualization geometry |
| main.jsx | Renders React application |

* **Details on the Visualization Page**  
  - **Scaling System**  
    * Base unit for sizing elements: x \= 34px  
    * Floor widths modeled on architectural proportions:

| Floor | Width |
| :---- | :---- |
| 2 | 14x |
| 6 | 12x |
| 1, 5, 7 | 10x |
| 4, 8 | 8x |

      This creates a geometric representation of Geisel’s floor structure

  - **Floor Bars**  
    * Each floor is displayed as a row with:  
      Floor label (left) → Bar visualization (center) → Live count (right)  
    * Occupancy is computed using:  
      Fill % \= (device\_count / floor\_capacity) × 100  
    * Bars fill from the center outward, using animated gradient progression to visually reflect density.  
    * Capacity values differ per floor and are stored in FLOOR\_CAPACITY.  
  - **Connector Bars Between Floors**  
    * Connectors simulate the concrete structural transitions between building levels.  
    * Standard connectors use:  
      Height: 0.2x, width varies based on layout.  
    * Special 2nd–4th floor connector:  
      * Total size: 8.2x width × 1.2x height  
      * Split exactly using:  
        0.2x | 1.9x gap | 4x center | 1.9x gap | 0.2x  
      * Left and right segments slightly increased to 0.28x to remove visible gaps.  
      * Only the top border is drawn to visually align with slanted supports.  
  - **Slanted Parallelogram Support Columns**  
    Simulating the diagonal supports attached to the connector bar:

| Property | Value |
| :---- | :---- |
| Width | 0.3x |
| Height | 2.4x |
| Left angle | 40° |
| Right angle | \-40° |
| Connection | Positioned at the bottom:100% of connector bar |

    These were designed so their base aligns perfectly with the connector’s top border, creating a seamless architectural visual alignment.

  - **Timeline Chart Integration**  
    * Displays device count trends over time.  
    * Shows total data by default.  
    * When hovering over a floor bar:  
      * Chart switches to only that floor’s trend  
    * Only the most recent 20 reading pairs are shown for clarity.  
    * Chart updates immediately with Firebase data, preserving high responsiveness.  
* **Internal Data Processing**

| Step | Logic |
| :---- | :---- |
| Timestamp grouping | Readings grouped using timestamp values |
| Floor snapshot | Most recent entry per floor selected |
| Total count | Sum of latest floor values |
| Per-floor series | Built for timeline hover display |
| Floors without data | Displayed as \-- in UI |

* **Data Input Page (Demo only)**  
  - Used only during early frontend testing  
  - Does not write to Firebase in the final system  
  - Final real-time updates exclusively use ESP32 \- generated Firebase data.  
* **Error & Security Handling**

| Area | Handling |
| :---- | :---- |
| Firebase failure | Logged silently |
| No data | Placeholder text displayed |
| Demo input validation | Error message shown |
| Sensitive info protection | All Firebase credentials stored using .env |

**Geisel Occupancy Tracker ESP32 Software**

* **Overview**  
  - This program implements the Bluetooth Low Energy (BLE) scanning functionality for data collection with an ESP32 device through Arduino IDE. The program has the ESP32 scan for nearby device signals, hash incoming MAC addresses from common major smartphone manufacturers, identify the count of unique hashed addresses, and upload the recorded count to a Firebase Realtime Database at a specified interval for data storage.  
* **Program Architecture**  
  - **Libraries:**  
    * WiFi.h  
      * Connects ESP32 to UCSD-DEVICE network  
    * FirebaseESP32.h  
      * Uploads data to Firebase Realtime Database  
    * mbedtls/sha256.h  
      * Hashes device MAC addresses (privacy and legality)  
    * NimBLEDevice.h  
      * Handles BLE Device Scanning  
    * vector  
      * Hashed device address storage  
  - **Runtime Sequence**  
1. ESP32 connects to WiFi (UCSD-DEVICE) with ssid and password and   
2. Firebase connection is initialized with credentials and tested for potential errors  
3. NimBLEDevice scanning and scanner object initialized  
4. BLE scanning loop begins on set interval  
   1. Check for valid manufacturer ID for every new device detected  
   2. Hash incoming device MAC address  
   3. Check if hashed address is unique in vector hash array and append if true  
   4. Get vector hash array size (device count) and upload to Firebase Realtime Database in desired JSON format  
   5. Clear vector hash array  
* **Class Documentation (MyCallbacks)**  
  - **Purpose:**  
    * Subclass of NimBLEScanCallbacks from NimBLEDevice.h. Handles BLE advertisement results during scan.  
  - **void onResult()**  
    * **Overview:**  
      * Overrides onResult() inherited from NimBLEDevice.h  
      * Automatically called for every new device detected during BLE scanning  
      * Adds every valid unique hashed MAC address to a temporary global vector array  
    * **Manufacturer ID Filter:**  
      * Determines if the manufacturer ID of a scanned device is from a valid smartphone company

| 0x004C | Apple, Inc. |
| :---- | :---- |
| 0x00E0 | Google LLC  |
| 0x00DA | txtr GmbH |
| 0x0075 | Samsung Electronics Co., Ltd. |
| 0x00E5 | Eden Software Consultants Ltd. |
| 0x038F | Xiaomi Inc. |
| 0x02E0 | Microsoft Inc. |

    * **BLE Scanning Logic:**  
      * Get device MAC address as readable string  
      * Process MAC address through SHA-256  
      * Convert hashed address to hex string  
      * Determine if the hashed address unique in previously recorded devices to prevent double counting  
      * Store hashed address in hashedDevices vector array  
* **Initializations (setup())**  
  - **WiFi Setup**  
    * Initialize baud on 115200  
    * Begin attempt to connect to WiFi (UCSD-DEVICE) with ssid and password credentials  
    * Looping print statement (“.”) until WiFi is successfully connected  
    * Print confirmation message  
  - **Firebase Configuration**  
    * Configure Firebase setup with FIREBASE\_HOST and FIREBASE\_AUTH credentials to establish connection with database  
    * Create a test path and upload test message for debugging  
      * Print confirmation or error statements corresponding to successful or unsuccessful upload  
  - **BLE Scanner Configuration**  
    * Initialize the NimBLE stack  
      * Sets up the ESP32’s Bluetooth controller  
      * Prepare memory, drivers, and BLE functionality  
    * Retrieve global BLE scanner object  
    * Enable active scanning  
      * ESP32 sends scan requests asking devices for extra data  
    * Set scanning interval in milliseconds  
    * Register MyCallbacks class with the scanner object  
* **Main Loop (loop())**  
  - **Device Count Collection**  
    * Start a BLE scan for a specified duration  
      * This calls onResult() for every new device detected  
    * Collect size (device count) of vector hash array after scan  
  - **Data Uploading**  
    * Format and update JSON with new values to be sent  
    * Upload data (device count) to Firebase Realtime Database  
      * Print confirmation or error statements corresponding to successful or unsuccessful upload  
  - **Ensure Privacy**  
    * Clear hashed address array in preparation for new scan  
* **Limitations**  
  - BLE scan duration may not be too short or too long to accurately read device counts if there is too high or slow device traffic.  
  - Potential Firebase upload rate limitations  
  - Edge cases for duplicate detection may exist that have not been accounted for  
  - Missing known manufacturer IDs  
  - SHA-256 hash process hardware costs  
* **Future Improvements**  
  - Reduce Firebase writes by batching to overcome upload rate limitations if necessary  
  - Add RSSI thresholding to filter out weak device signals