let serial;
let latestData = "waiting for data"; // Variable to hold data from Arduino
let startX, startY; // Variables to store start position of the line

function setup() {
  createCanvas(400, 400);
  startX = width / 2;
  startY = height / 2;
  
  // Set up serial communication
  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.on('data', serialEvent);
  serial.list();
  serial.open('COM3'); // Change this to the appropriate port
}

function draw() {
  background(220);
  
  // Draw line from start position to current mouse position
  stroke(0);
  strokeWeight(2);
  line(startX, startY, mouseX, mouseY);
  
  // Calculate length of the line
  let lineLength = dist(startX, startY, mouseX, mouseY);
  
  // Map line length to LED brightness
  let brightness = int(map(lineLength, 0, sqrt(width * width + height * height), 0, 255));
  
  // Display latest data from Arduino
  textSize(20);
  textAlign(CENTER);
  text("Line Length: " + lineLength.toFixed(2), width/2, height - 20);
  text("LED Brightness: " + brightness, width/2, height - 50);
  
  // Send brightness value to Arduino
  serial.write(brightness + '\n');
}

function serialEvent() {
  // Read serial data as a string until new line character
  let message = serial.readStringUntil('\n');
  
  // Trim any whitespace or newlines from the message
  message = message.trim();
  
  // Update latestData with the received message
  latestData = message;
}

function printList(portList) {
  // Print available serial ports to console
  for (let i = 0; i < portList.length; i++) {
    console.log(i + " " + portList[i]);
  }
}
