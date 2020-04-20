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
  gigglebot.motorPowerAssign(gigglebotWhichMotor.Both, 0);
  basic.showIcon(IconNames.No);
});

bluetooth.onBluetoothConnected(() => {
  connected = true;
  basic.showIcon(IconNames.Happy);
  while (connected) {

    /* Light sensors */
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

    /* Line */
    const leftLine = gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left);
    const rightLine = gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Right);
    bluetooth.uartWriteString(
      "line-sens:" +
        convertToText(leftLine) +
        "," +
        convertToText(rightLine)
    );

    /* micro:bit temperature */
    const microbitTemperature = input.temperature();
    bluetooth.uartWriteString(
      "ub-temp-sens:" +
        convertToText(microbitTemperature)
    );

    /* Acceleration */
    const xAcceleration = input.acceleration(Dimension.X);
    const yAcceleration = input.acceleration(Dimension.Y);
    const zAcceleration = input.acceleration(Dimension.Z);
    bluetooth.uartWriteString(
      "accel:" +
        convertToText(xAcceleration) +
        "," +
        convertToText(yAcceleration) +
        "," +
        convertToText(zAcceleration)
    );

    /* Gyro */
    const pitch = input.rotation(Rotation.Pitch);
    const roll = input.rotation(Rotation.Roll);
    bluetooth.uartWriteString(
      "gyro:" +
        convertToText(pitch) +
        "," +
        convertToText(roll)
    );

    /* Battery voltage */
    const batteryVoltage =  gigglebot.voltageBattery();
    bluetooth.uartWriteString(
      "battery-sens:" +
        convertToText(batteryVoltage)
    );

    /* micro:bit ambient light */
    const microbitLightLevel = input.lightLevel();
    bluetooth.uartWriteString(
      "ub-light-sens:" +
        convertToText(microbitLightLevel)
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
