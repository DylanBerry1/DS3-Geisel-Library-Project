#include <WiFi.h>

// all chips used in the project will connect to this network
const char* ssid = "UCSD_DEVICE";

// this is given to us by the ucsd IT team
const char* password = "";

// all Arduino sketches will have a setup() and loop() function as seen below

// setup runs once when the board is powered on or reset (when the reset button is pressed)
// its really, really small so!
void setup() {

  // Start the Serial Monitor so we can print messages to the computer 
  // (click the magnifying glass icon at the top right of the arduino IDE)
  // OR click Tools > Serial Monitor to open sort of like a vscode terminal
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// loop() runs over and over forever after setup() finishes until the battery runs out basically
void loop() {
  // Right now, the loop is empty, which means the board does nothing repeatedly.
}