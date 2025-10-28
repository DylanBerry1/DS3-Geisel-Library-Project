#include <WiFi.h>

// Include the mbedTLS library to access pre-built hashes
#include "mbedtls/sha256.h"

void setup() {
  Serial.begin(115200);

  // Create a 6-byte array to store the ESPs MAC address
  uint8_t mac[6];

  // Get the MAC address of the ESP32 Wi-Fi interface
  // Every device has a unique MAC address and looks like this: 30:AE:A4:1B:2C:7E
  WiFi.macAddress(mac);

  // Initialize an empty string to store the MAC address as a readable hex string
  String macStr = "";

  // Loop through all 6 bytes of the MAC address
  for (int i = 0; i < 6; i++) {
    // Convert each byte to a hexadecimal string and append it to macStr
    // Example: if mac = [0x30, 0xAE, 0xA4, 0x1B, 0x2C, 0x7E]
    // macStr becomes "30aea41b2c7e"
    macStr += String(mac[i], HEX);
  }

  // Create an array to hold the 32-byte (256-bit) SHA-256 hash output
  unsigned char hash[32];

  // Declare a SHA-256 context variable (basically internal 'scratch paper')
  mbedtls_sha256_context ctx;

  // Initialize the SHA-256 context before using it
  mbedtls_sha256_init(&ctx);

  // Start the SHA-256 hashing process
  // The second argument (0) means we are using SHA-256 (not SHA-224 which is just another hashing method)
  mbedtls_sha256_starts(&ctx, 0);

  // throw the MAC address string into the hash function
  mbedtls_sha256_update(&ctx, (const unsigned char*)macStr.c_str(), macStr.length());

  // Finish the hashing process and store the final 32-byte result into the "hash" array
  mbedtls_sha256_finish(&ctx, hash);

  // Free memory and clean up the hashing context after use
  mbedtls_sha256_free(&ctx);

  Serial.print("Original MAC: ");
  Serial.println(macStr);
  Serial.print("SHA-256 Hash: ");

  // Loop through all 32 bytes of the resulting hash
  for (int i = 0; i < 32; i++) {
    // Print each byte of the hash in two-digit hexadecimal format
    // %02x ensures each byte is represented as two hex digits (e.g., "0a" instead of "a")
    Serial.printf("%02x", hash[i]);
  }

  Serial.println();
}

// In this case, it is empty because the program only hashs the MAC once
void loop() {}
