/*
 * GLOBAL VARIABLES
 */
let value = 0;
let command = "";
let connected = false;

/*
 * EVENT HANDLERS
 */
input.onButtonPressed(Button.A, () => {
  bluetooth.uartWriteString("left-sensor:1");
});

input.onButtonPressed(Button.B, () => {
  bluetooth.uartWriteString("left-sensor:0");
});

bluetooth.onBluetoothDisconnected(() => {
  connected = false;
  basic.showIcon(IconNames.No);
});

bluetooth.onBluetoothConnected(() => {
  connected = true;
  basic.showIcon(IconNames.Happy);
  while (connected) {
    const leftLightSensorValue = gigglebot.lightReadSensor(
      gigglebotWhichTurnDirection.Left
    );
    const rightLightSensorValue = gigglebot.lightReadSensor(
      gigglebotWhichTurnDirection.Right
    );
    bluetooth.uartWriteString(
      "light-sens:" +
        convertToText(leftLightSensorValue) +
        "," +
        convertToText(rightLightSensorValue)
    );

     basic.pause(500);
  }
});

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
  command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Colon));
  if ("left-motor" === command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Left, value);
    led.plotBrightness(0, 0, (value * 255) / 100);
  } else if ("right-motor" === command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Right, value);
    led.plotBrightness(4, 0, (value * 255) / 100);
  } else if ("both-motors" === command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Both, value);
    led.plotBrightness(0, 0, (value * 255) / 100);
    led.plotBrightness(4, 0, (value * 255) / 100);
  }
});

/*
 * ON START
 */
bluetooth.startUartService();
basic.showString("R"); // "R" for "ready"
