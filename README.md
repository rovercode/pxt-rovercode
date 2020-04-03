# pxt-rovercode

## Development Usage

```bash
$ sudo npm install -g pxt
$ pxt target microbit
$ pxt install
$ pxt build # output at built/binary.hex
```

## Protocol

The following protocol is used over the Nordic virtual BLE serial channel.

The common format is `{identifier}:{comma-separated values}`.
Messages from the webapp to the micro:bit end with a `\n`; messages from the micro:bit to the webapp do not.

### Set motor power

#### Direction
webapp -> micro:bit

#### Identifier
`set-left-motor` and `set-right-motor`

#### Data
| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Motor power                 | Number | 0-100             |

#### Example
```
set-left-motor:0\n
set-right-motor:100\n
```

### Sensor status

#### Direction
micro:bit -> webapp

#### Identifier

`sensor-status`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Left light sensor value     | Number | 0-255             |
| 1        | Right light sensor value    | Number | 0-255             |
| 2        | Left line sensor value      | Number | 0-1023            |
| 3        | Right line sensor value     | Number | 0-1023            |
| 4        | Sonar distance sensor value | Number | 0 - ? millimeters |
| 5        | micro:bit ambient temp      | Number | Degrees C         |
| 6        | micro:bit light level       | Number | 0 - 255           |
| 7        | Acceleration (x)            | Number | milligravities    |
| 8        | Acceleration (y)            | Number | milligravities    |
| 9        | Acceleration (z)            | Number | milligravities    |
| 10       | Rotation (pitch)            | Number | Degrees           |
| 11       | Rotation (roll)             | Number | Degrees           |
| 12       | Compass heading             | Number | Degrees           |
| 13       | Battery voltage             | Number | Degrees           |
| 14       | Magnetic force              | Number | uT                |
| 15       | Dew point                   | Number | Degrees C         |

#### Example
```
sensor-state:0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
```

## TODO

- [ ] Add a reference for your blocks here
- [ ] Add "icon.png" image (300x200) in the root folder
- [ ] Add "- beta" to the GitHub project description if you are still iterating it.
- [ ] Turn on your automated build on https://travis-ci.org
- [ ] Use "pxt bump" to create a tagged release on GitHub
- [ ] Get your package reviewed and approved https://makecode.microbit.org/packages/approval

Read more at https://makecode.microbit.org/packages/build-your-own

## License



## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)

