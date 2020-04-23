/*
 * GLOBAL VARIABLES
 */
let value = 0;
let command = "";
let connected = false;
let leftLightSensorValue;
let rightLightSensorValue;
let leftLine;
let rightLine;
let microbitLightLevel;
let microbitTemperature;
let xAcceleration;
let yAcceleration;
let zAcceleration;
let pitch;
let roll;
let batteryVoltage;

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
    leftLightSensorValue = gigglebot.lightReadSensor(
      gigglebotWhichTurnDirection.Left
    );
    rightLightSensorValue = gigglebot.lightReadSensor(
      gigglebotWhichTurnDirection.Right
    );
    bluetooth.uartWriteString(
      "light-sens:" +
        convertToText(leftLightSensorValue) +
        "," +
        convertToText(rightLightSensorValue)
    );

    /* Line */
    leftLine = gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left);
    rightLine = gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Right);
    bluetooth.uartWriteString(
      "line-sens:" +
        convertToText(leftLine) +
        "," +
        convertToText(rightLine)
    );

    /* micro:bit temperature */
    microbitTemperature = input.temperature();
    bluetooth.uartWriteString(
      "ub-temp-sens:" +
        convertToText(microbitTemperature)
    );

    /* Acceleration */
    xAcceleration = input.acceleration(Dimension.X);
    yAcceleration = input.acceleration(Dimension.Y);
    zAcceleration = input.acceleration(Dimension.Z);
    bluetooth.uartWriteString(
      "accel:" +
        convertToText(xAcceleration) +
        "," +
        convertToText(yAcceleration) +
        "," +
        convertToText(zAcceleration)
    );

    /* Gyro */
    pitch = input.rotation(Rotation.Pitch);
    roll = input.rotation(Rotation.Roll);
    bluetooth.uartWriteString(
      "gyro:" +
        convertToText(pitch) +
        "," +
        convertToText(roll)
    );

    /* Battery voltage */
    batteryVoltage =  gigglebot.voltageBattery();
    bluetooth.uartWriteString(
      "battery-sens:" +
        convertToText(batteryVoltage)
    );

    /* micro:bit ambient light */
    microbitLightLevel = input.lightLevel();
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
