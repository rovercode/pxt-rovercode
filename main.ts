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
basic.pause(500);
basic.showString("R");
basic.pause(2000);
basic.showString(control.deviceName());
basic.showString("R");

while(true) {
  if (connectEventFlag) {
    connected = true;
    basic.showIcon(IconNames.Happy);
    connectEventFlag = false;
  }
  if (disconnectEventFlag) {
    connected = false;
    basic.showString("R");
    basic.pause(2000);
    basic.showString(control.deviceName());
    basic.showString("R");
    gigglebot.motorPowerAssign(gigglebotWhichMotor.Both, 0);
    disconnectEventFlag = false;
  }
  if (connected) {
    while (busyHandlingCommand) {
      basic.pause(10);
    };
    busyPolling = true;

    /* Buttons */
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

    /* Battery voltage */
    bluetooth.uartWriteString(
      "battery-sens:" +
        convertToText(gigglebot.voltageBattery())
    );

    // /* micro:bit temperature */
    // bluetooth.uartWriteString(
    //   "ub-temp-sens:" +
    //     convertToText(input.temperature())
    // );

    // TODO: Figure out why this doesn't work with light sensors above.
    // /* Line */
    // bluetooth.uartWriteString(
    //   "line-sens:" +
    //     convertToText(gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left)) +
    //     "," +
    //     convertToText(gigglebot.lineReadSensor(gigglebotWhichTurnDirection.Left))
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

    // /* micro:bit ambient light */
    // bluetooth.uartWriteString(
    //   "ub-light-sens:" +
    //     convertToText(input.lightLevel())
    // );

    busyPolling = false;
  }
  basic.pause(500);
}
