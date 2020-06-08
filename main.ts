/*
 * GLOBAL VARIABLES
 */
let connectEventFlag = false;
let disconnectEventFlag = false;
let buttonAEventFlag = false;
let buttonBEventFlag = false;
let busyPolling = false;
let busyHandlingCommand = false;

/*
 * EVENT HANDLERS
 */
input.onButtonPressed(Button.A, () => {
  buttonAEventFlag = true;
});

input.onButtonPressed(Button.B, () => {
  buttonBEventFlag = true;
});

bluetooth.onBluetoothDisconnected(() => {
  disconnectEventFlag = true;
});

bluetooth.onBluetoothConnected(() => {
  connectEventFlag = true;
});

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), () => {
  while (busyPolling) {
    basic.pause(10);
  }
  busyHandlingCommand = true;
  let value = 0;
  let command = "";
  let message = "";
  command = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Colon));
  if ("left-motor" === command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Left, value);
  } else if ("right-motor" === command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Right, value);
  } else if ("both-motors" === command) {
    value = parseFloat(
      bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    );
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Both, value);
  } else if ("disp" === command) {
    message = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine));
    basic.showString(message);
    basic.showIcon(IconNames.Happy);
  }
  busyHandlingCommand = false;
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
    /* Buttons */
    while (busyHandlingCommand) {
      basic.pause(10);
    };
    busyPolling = true;
    if (buttonAEventFlag) {
      bluetooth.uartWriteString("button:a");
      buttonAEventFlag = false;
    }
    if (buttonBEventFlag) {
      bluetooth.uartWriteString("button:b");
      buttonBEventFlag = false;
    }

    /* Light sensors */
    bluetooth.uartWriteString(
      "light-sens:" +
        convertToText(gigglebot.lightReadSensor(gigglebotWhichTurnDirection.Left)) +
        "," +
        convertToText(gigglebot.lightReadSensor(gigglebotWhichTurnDirection.Right))
    );

    busyPolling = false;

    // TODO: Figure out why this doesn't work with light sensors above.
    // /* Line */
    // bluetooth.uartWriteString(
    //   "line-sens:" +
    //     convertToText(gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left)) +
    //     "," +
    //     convertToText(gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left))
    // );

    // /* micro:bit temperature */
    // bluetooth.uartWriteString(
    //   "ub-temp-sens:" +
    //     convertToText(input.temperature())
    // );

    // /* Acceleration */
    // bluetooth.uartWriteString(
    //   "accel:" +
    //     convertToText(input.acceleration(Dimension.X)) +
    //     "," +
    //     convertToText(input.acceleration(Dimension.Y)) +
    //     "," +
    //     convertToText(input.acceleration(Dimension.Z))
    // );

    // /* Gyro */
    // bluetooth.uartWriteString(
    //   "gyro:" +
    //     convertToText(input.rotation(Rotation.Pitch)) +
    //     "," +
    //     convertToText(input.rotation(Rotation.Roll))
    // );

    // /* Battery voltage */
    // bluetooth.uartWriteString(
    //   "battery-sens:" +
    //     convertToText(gigglebot.voltageBattery())
    // );

    // /* micro:bit ambient light */
    // bluetooth.uartWriteString(
    //   "ub-light-sens:" +
    //     convertToText(input.lightLevel())
    // );
  }
  basic.pause(500);
}
