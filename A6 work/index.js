

const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
const portName = "/dev/cu.usbmodem1301";

let serial;
let connectBtn;
let ledBtn;
let text_x;
let text_y;
let x;
let y;

/*
function debug(){
  document.title = "!!!!!!!!!!!!!!1";
}

debug();
*/

function ReadInput() {
  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length > 0 && str[0]=="X"){
    // "X=...."
    x = Number(str.substring(2));
    text_x.innerHTML = String(x);
  } else if (str.length > 0 && str[0]=="Y"){
    // "Y=...."
    y = Number(str.substring(2)); 
    text_y.innerHTML = String(y);
  }
}

function checkPort() {
  // this will check if connection is on and update the button
  if (!serial.opened()) {
    // If the port is not open, change button text
    connectBtn.innerHTML = "Connect";
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.innerHTML = "Disconnect";
    return true;
  }
}

function onConnect() {
  // When the connect button is clicked
  if (!serial.opened()) {
    // If the port is not opened, we open it
    let options = {
      baudRate: BAUD_RATE
    };
    serial.open(portName, options);
      serial.clear();
  } else {
    // Otherwise, we close it!
    serial.close();
  }

  // this will check if connection is on and update the button
  checkPort();
}

function onLED(){
  if(ledBtn.innerHTML=="Turn LED ON"){
    serial.write(48); // ASCII  '0' = 48
    ledBtn.innerHTML=="Turn LED OFF";
  }else{
    serial.write(49); // ASCII  '1' = 49
    ledBtn.innerHTML=="Turn LED ON";
  }
}


function gotList(thelist) {
  if(thelist.length==0) return;
  let text;
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    text = text + String(i) + " " + thelist[i] + "<br>"
  }
  document.getElementById("ports").innerHTML = text;
}

function setupSerial() {
  document.getElementById("ports").innerHTML = "loading list...";
  serial =  new p5.SerialPort();
  document.getElementById("ports").innerHTML = "loading list---";
  let portlist = serial.list();
  document.getElementById("ports").innerHTML = "portlist.length="+String(portlist.length);
  gotList(portlist);

  // setup callback that gets triggered on data (X or Y prints)
  serial.on('data',ReadInput);

  let options = {
    baudRate: BAUD_RATE
  };
  //serial.open(portName, options);
  serial.open(portName);
  serial.clear();

  checkPort();
}

function setup() {
  connectBtn = document.getElementById("button_SERIAL");
  ledBtn = document.getElementById("button_LED");
  text_x = document.getElementById("joystic_x");
  text_y = document.getElementById("joystic_y");
  document.getElementById("ports").innerHTML = "...<br>";

  setupSerial(); // Run our serial setup function (below)
  //setInterval(ReadInput, 100);
}

setup();
