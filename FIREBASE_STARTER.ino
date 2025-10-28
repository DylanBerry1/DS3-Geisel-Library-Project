#include <WiFi.h>

// Include the Firebase library for ESP32 
#include <FirebaseESP32.h>

// this is just your firebaseio.com
#define FIREBASE_HOST ""

// this is if you want to test an auth key, which you can add in firebase rules
#define FIREBASE_AUTH ""

// this is the same as before if your at UCSD otherwise use other wifi credentials
const char* ssid = "UCSD-DEVICE";
const char* password = "";

// Create global Firebase objects
// fbdo: handles the connection and responses to/from Firebase
// auth: stores authentication credentials (unused if no login is needed)
// config: stores host and key settings for Firebase initialization
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");

  // Set Firebase configuration details:
  // Host is your Firebase Realtime Database endpoint
  config.host = FIREBASE_HOST;

  // Set authentication key (if used). This can be empty for open databases
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  // Initialize Firebase with your configuration and authentication settings
  Firebase.begin(&config, &auth);

  Serial.println("Uploading test data ...");

  // Send a JSON object to Firebase at path "/test"
  // IMPORTANT TO NOTE, fireabse will create path /test if it does not yet exist!
  // The JSON is sent as string literal
  if (Firebase.setJSON(fbdo, "/test", "{\"message\":\"Hello Firebase!\"}")) {
    // If upload is successful, prints confirmation
    Serial.println("Upload successful!");
  } else {
    // If upload fails, prints the error reason returned by Firebase
    Serial.println(fbdo.errorReason());
  }
}

// nothing going on here yet
void loop() {}
