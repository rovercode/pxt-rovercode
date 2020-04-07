# pxt-rovercode

## Development Usage

```bash
$ npm install
$ npm run lint  # run the style checker
$ npm run build  # output at built/rovercode.hex
$ npm run flash:mac  # flash rovercode.hex to the micro:bit connected to your Mac
$ # or
$ npm run flash:linux  # flash rovercode.hex to the micro:bit connected to an Ubuntu machine 
```

## Protocol

The following protocol is used over the Nordic virtual BLE serial channel.

The common format is `{identifier}:{comma-separated values}`.
Messages from the webapp to the micro:bit end with a `\n`; messages from the micro:bit to the webapp do not.

In all cases, "left" and "right" are when facing the direction that the micro:bit LED grid faces when plugged into the Gigglebot.

### Set motor power

#### Direction
webapp -> micro:bit

#### Identifier
`left-motor` and `right-motor` and `both-motors`.

#### Data
| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Motor power                 | Number | -100 to 100       |

#### Example
```
left-motor:0\n
right-motor:100\n
both-motors:-40\n
```

### Light Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`light-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Left light sensor value     | Number | 0-1023            |
| 1        | Right light sensor value    | Number | 0-1023            |

#### Example
```
light-sens:1023,1023
```

### Line Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`line-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Left line sensor value      | Number | 0-1023            |
| 1        | Right line sensor value     | Number | 0-1023            |

#### Example
```
line-sens:1023,1023
```

### Distance Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`dist-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Sonar distance sensor value | Number | 0 - ? millimeters |

#### Example
```
dist-sens:1000
```

### uBit Temperature Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`ub-temp-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | micro:bit ambient temp      | Number | Degrees C         |

#### Example
```
ub-temp-sens:24
```

### uBit Light Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`ub-light-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | micro:bit light level       | Number | 0 - 255           |

#### Example
```
ub-light-sens:255
```

### Acceleration Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`accel`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Acceleration (x)            | Number | milligravities    |
| 1        | Acceleration (y)            | Number | milligravities    |
| 2        | Acceleration (z)            | Number | milligravities    |

#### Example
```
accel:1000,1000,1000
```

### Gyroscope Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`gyro`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Rotation (pitch)            | Number | Degrees           |
| 1        | Rotation (roll)             | Number | Degrees           |

#### Example
```
gyro:100,100
```

### Compass Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`compass-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Compass heading             | Number | Degrees            |

#### Example
```
compass-sens:100
```

### Magnetic Force Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`mag-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Magnetic force              | Number | uT                |

#### Example
```
mag-sens:60
```

### Battery Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`battery-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Battery voltage             | Number | milliVolts        |

#### Example
```
battery-sens:3300
```

### Dew Point Sensor

#### Direction
micro:bit -> webapp

#### Identifier

`dewpoint-sens`

#### Data

| Index    | Description                 | Type   | Unit              |
|----------|-----------------------------|--------|-------------------|
| 0        | Dew point                   | Number | Degrees C         |

#### Example
```
dewpoint-sens:24
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

