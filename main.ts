let value = 0;
let command = "";
input.onButtonPressed(Button.A, function() {
  bluetooth.uartWriteString("left-sensor:1");
});
input.onButtonPressed(Button.B, function() {
  bluetooth.uartWriteString("left-sensor:0");
});
bluetooth.onBluetoothConnected(function() {
//   basic.showIcon(IconNames.Yes);
  while (true) {
    basic.showIcon(IconNames.Happy);
    bluetooth.uartWriteString("sensor-state:0,0");
    basic.pause(2000);
  }
});
input.onGesture(Gesture.Shake, function() {
  bluetooth.uartWriteString("S");
});
bluetooth.onBluetoothDisconnected(function() {
  basic.showIcon(IconNames.No);
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
  basic.showIcon(IconNames.Yes);
});
bluetooth.startUartService();
basic.showString("R")
