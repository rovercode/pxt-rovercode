/*
 * GLOBAL VARIABLES
 */
let connectEventFlag = false;
let disconnectEventFlag = false;
let buttonAEventFlag = false;
let buttonBEventFlag = false;
let busyPolling = false;
let busyHandlingCommand = false;
let sensors = [0, 0]

function sensorsRaw(which: number): number[] {
    // which is 4 for battery voltage
    // which is 5 for line sensor
    // which is 6 for light sensor
    const buf = pins.createBuffer(1)
    buf.setNumber(NumberFormat.UInt8BE, 0, which)
    pins.i2cWriteBuffer(0x04, buf)
    if (which === 4) {
        pins.i2cWriteBuffer(0x04, buf)
        const rawBuffer = pins.i2cReadBuffer(0x04, 2)
        sensors[0] = rawBuffer.getNumber(NumberFormat.UInt16BE, 0)
        sensors[1] = 0
    } else {
        const rawBuffer = pins.i2cReadBuffer(0x04, 3)
        for (let _i = 0; _i < 2; _i++) {
            sensors[_i] = (rawBuffer.getNumber(NumberFormat.UInt8BE, _i) << 2)
            sensors[_i] |= (((rawBuffer.getNumber(NumberFormat.UInt8BE, 2) << (_i * 2)) & 0xC0) >> 6)
            sensors[_i] = 1023 - sensors[_i]
        }
    }
    return sensors
}
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
    sensors = sensorsRaw(6)
    bluetooth.uartWriteString(
        "light-sens:" + convertToText(sensors[1]) + ", " + convertToText(sensors[0])
    );

    /* Line */
    sensors = sensorsRaw(5)
    bluetooth.uartWriteString(
        "line-sens:" +
        convertToText(sensors[1]) + ", " + convertToText(sensors[0])
    );

      /* Battery voltage */
      sensors = sensorsRaw(4)
      bluetooth.uartWriteString(
          "battery-sens:" +
          convertToText(sensors[0])
      );

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

    // /* micro:bit ambient light */
    // bluetooth.uartWriteString(
    //   "ub-light-sens:" +
    //     convertToText(input.lightLevel())
    // );

    busyPolling = false;
  }
  basic.pause(500);
}
