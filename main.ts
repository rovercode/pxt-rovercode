/*
 * GLOBAL VARIABLES
 */
let value = 0;
let command = "";
let connected = false;

/*
 * EVENT HANDLERS
 */
input.onButtonPressed(Button.A, function() {
  bluetooth.uartWriteString("left-sensor:1");
});

input.onButtonPressed(Button.B, function() {
  bluetooth.uartWriteString("left-sensor:0");
});

bluetooth.onBluetoothDisconnected(function() {
  connected = false;
  basic.showIcon(IconNames.No);
});

bluetooth.onBluetoothConnected(function() {
  connected = true;
  basic.showIcon(IconNames.Happy);
  while (connected) {
    // TODO: Read sensor values and build sensor-state string here.
    bluetooth.uartWriteString("sensor-state:0,0,0,0,0,0,0,0,0,0,0,0,0,0");
    basic.pause(2000);
  }
});

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function() {
  command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Colon));
  if ("left-motor" == command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Left, value);
    led.plotBrightness(0, 0, (value * 255) / 100);
  } else if ("right-motor" == command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Right, value);
    led.plotBrightness(0, 0, (value * 255) / 100);
  }
});

/*
 * ON START
 */
bluetooth.startUartService();
basic.showString("R")  // "R" for "ready"
