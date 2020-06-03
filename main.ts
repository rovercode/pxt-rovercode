/*
 * GLOBAL VARIABLES
 */
let connectEventFlag = false;
let disconnectEventFlag = false;

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
  disconnectEventFlag = true;
});

bluetooth.onBluetoothConnected(() => {
  connectEventFlag = true;
});

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
  let value = 0;
  let command = "";
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
let connected = false;
bluetooth.startUartService();
basic.showString("R"); // "R" for "ready"

while(true) {
  if (connectEventFlag) {
    connected = true;
    basic.showIcon(IconNames.Happy);
    connectEventFlag = false;
  }
  if (disconnectEventFlag) {
    connected = false;
    basic.showString("R");
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Both, 0);
    disconnectEventFlag = false;
  }
  if (connected) {
    /* Light sensors */
    bluetooth.uartWriteString(
      "light-sens:" +
        convertToText(gigglebot.lightReadSensor(gigglebotWhichTurnDirection.Left)) +
        "," +
        convertToText(gigglebot.lightReadSensor(gigglebotWhichTurnDirection.Right))
    );

    // TODO: Figure out why this doesn't work with light sensors above.
    // /* Line */
    // bluetooth.uartWriteString(
    //   "line-sens:" +
    //     convertToText(gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left)) +
    //     "," +
    //     convertToText(gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left))
    // );

    /* micro:bit temperature */
    bluetooth.uartWriteString(
      "ub-temp-sens:" +
        convertToText(input.temperature())
    );

    /* Acceleration */
    bluetooth.uartWriteString(
      "accel:" +
        convertToText(input.acceleration(Dimension.X)) +
        "," +
        convertToText(input.acceleration(Dimension.Y)) +
        "," +
        convertToText(input.acceleration(Dimension.Z))
    );

    /* Gyro */
    bluetooth.uartWriteString(
      "gyro:" +
        convertToText(input.rotation(Rotation.Pitch)) +
        "," +
        convertToText(input.rotation(Rotation.Roll))
    );

    /* Battery voltage */
    bluetooth.uartWriteString(
      "battery-sens:" +
        convertToText(gigglebot.voltageBattery())
    );

    /* micro:bit ambient light */
    bluetooth.uartWriteString(
      "ub-light-sens:" +
        convertToText(input.lightLevel())
    );
  }
  basic.pause(500);
}
