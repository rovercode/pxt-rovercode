let value = "";
let command = "";
input.onButtonPressed(Button.A, function() {
  bluetooth.uartWriteString("left-sensor:1");
});
input.onButtonPressed(Button.B, function() {
  bluetooth.uartWriteString("left-sensor:0");
});
bluetooth.onBluetoothConnected(function() {
  basic.showIcon(IconNames.Yes);
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
    value = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Left, parseFloat(value));
    basic.showString("L:" + value);
  } else if ("right-motor" == command) {
    value = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Right, parseFloat(value));
    basic.showString("R:" + value);
  }
  basic.showIcon(IconNames.Yes);
});
bluetooth.startUartService();
basic.showIcon(IconNames.SmallSquare);
