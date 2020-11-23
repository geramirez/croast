#include "arduino_secrets.h"
/*
  Dweet.io POST client for ArduinoHttpClient library
  Connects to dweet.io once every ten seconds,
  sends a POST request and a request body.

  Shows how to use Strings to assemble path and body

  created 15 Feb 2016
  modified 22 Jan 2019
  by Tom Igoe

  this example is in the public domain
*/
#include <TimeLib.h>

#include <ArduinoHttpClient.h>
#include <WiFi101.h>

///////please enter your sensitive data in the Secret tab/arduino_secrets.h
/////// Wifi Settings ///////
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

const char serverAddress[] = "crost.gigalixirapp.com";  // server address
String path = "/telemetry";
String contentType = "application/json";
int port = 80;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);
int status = WL_IDLE_STATUS;

#include "max6675.h"

int thermoDO = 0;
int thermoCS = 1;
int thermoCLK = 2;
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);

void setup() {
  Serial.begin(9600);
  while(!Serial);
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);                   // print the network name (SSID);

    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);
  }

  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
}

void loop() {

  String postData = "{\"temperature\":";
  postData += String(thermocouple.readCelsius());
  postData += "}";

  // send the POST request
  client.post(path, contentType, postData);

  // read the status code and body of the response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  delay(10000);
}
