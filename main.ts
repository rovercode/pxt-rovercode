/*
 * GLOBAL VARIABLES
 */
let value = 0;
let command = "";
let connected = false;
let leftLightSensorValue = 0;
let rightLightSensorValue = 0;
let leftLine = 0;
let rightLine = 0;
let microbitLightLevel = 0;
let microbitTemperature = 0;
let xAcceleration = 0;
let yAcceleration = 0;
let zAcceleration = 0;
let pitch = 0;
let roll = 0;
let batteryVoltage = 0;

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
while(true) {
  basic.showIcon(IconNames.Confused);
  leftLightSensorValue = gigglebot.lightReadSensor(
    gigglebotWhichTurnDirection.Left
  );
  rightLightSensorValue = gigglebot.lightReadSensor(
    gigglebotWhichTurnDirection.Right
  );
  leftLine = gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left);
  rightLine = gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Right);
  microbitTemperature = input.temperature();
  xAcceleration = input.acceleration(Dimension.X);
  yAcceleration = input.acceleration(Dimension.Y);
  zAcceleration = input.acceleration(Dimension.Z);
  pitch = input.rotation(Rotation.Pitch);
  roll = input.rotation(Rotation.Roll);
  batteryVoltage =  gigglebot.voltageBattery();
  microbitLightLevel = input.lightLevel();
  if (connected) {

    /* Light sensors */
    bluetooth.uartWriteString(
      "light-sens:" +
        convertToText(leftLightSensorValue) +
        "," +
        convertToText(rightLightSensorValue)
    );

    /* Line */
    bluetooth.uartWriteString(
      "line-sens:" +
        convertToText(leftLine) +
        "," +
        convertToText(rightLine)
    );

    /* micro:bit temperature */
    bluetooth.uartWriteString(
      "ub-temp-sens:" +
        convertToText(microbitTemperature)
    );

    /* Acceleration */
    bluetooth.uartWriteString(
      "accel:" +
        convertToText(xAcceleration) +
        "," +
        convertToText(yAcceleration) +
        "," +
        convertToText(zAcceleration)
    );

    /* Gyro */
    bluetooth.uartWriteString(
      "gyro:" +
        convertToText(pitch) +
        "," +
        convertToText(roll)
    );

    /* Battery voltage */
    bluetooth.uartWriteString(
      "battery-sens:" +
        convertToText(batteryVoltage)
    );

    /* micro:bit ambient light */
    bluetooth.uartWriteString(
      "ub-light-sens:" +
        convertToText(microbitLightLevel)
    );
  }
  basic.pause(500);
}
