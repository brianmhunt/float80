
const assert = require('assert')

const Float80 = require('../src/float80')
const Float48 = require('../src/float48')

/**
 * This is a list of trials.
 *
 * These are exponent first, mantissa last (i.e. big endian).
 */
const TRIALS_80 = [
  // Byte offset:
  // 9  8  7  6  5  4  3  2  1  0
  ["3f ff 80 00 00 00 00 00 00 00", '1'],
  ["bf ff 80 00 00 00 00 00 00 00", '-1'],
  ["3f fe 80 00 00 00 00 00 00 00", '0.5'],
  ["3f ff c0 00 00 00 00 00 00 00", '1.5'],
  ["40 02 a0 00 00 00 00 00 00 00", '10'],
  ["40 00 a0 00 00 00 00 00 00 00", '2.5'],
  ["40 05 c8 00 00 00 00 00 00 00", '100'],
  ["40 0c 9c 44 00 00 00 00 00 00", '10001'],
  ["40 0c 8c a2 00 00 00 00 00 00", "9000.5"],
  ["40 05 fa aa a6 4c 2f 83 7b 4a", "125.3333"],
  ["40 01 aa aa a9 f7 b5 ae a0 00", "5.333333"],
  ["40 01 b5 55 56 08 4a 51 60 00", "5.666667"],
  ["bf ff 80 00 00 00 00 00 00 00", "-1"],
  ["7f ff c0 00 00 00 00 00 00 00", "NaN"],
  ["ff ff c0 00 00 00 00 00 00 00", "NaN"], // BigNumber doesn't support -NaN
  ["7f ff 80 00 00 00 00 00 00 00", "Infinity"],
  ["ff ff 80 00 00 00 00 00 00 00", "-Infinity"],
]

describe("Float80.fromBytes", () => {
  TRIALS_80.forEach((trial) => {
    it(`Converts ${trial[0]} to ${trial[1]}`, () => {
      const bytes = trial[0].split(" ").map((hexStr) => parseInt(hexStr, 16))
      assert.equal(
        Float80.fromBytes(bytes).toString(),
        trial[1]
      )
    })
  })
})


const TRIALS_48 = [
  ["00 00 00 00 00 00", "0"],
  ["ff ff ff ff ff 00", "0"],
  ["00 00 00 00 00 81", "1"],
  ["80 00 00 00 00 81", "-1"],
  ["00 00 00 00 00 82", "2"],
  ["40 00 00 00 00 81", "1.5"],
  ["20 00 00 00 00 82", "2.5"],
  ["74 23 f4 00 d2 94", "999999.2502"],
  ["f4 23 f4 00 d2 94", "-999999.2502"]
]

describe("Float48.fromBytes", () => {
  TRIALS_48.forEach((trial) => {
    it(`Converts ${trial[0]} to ${trial[1]}`, () => {
      const bytes = trial[0].split(" ").map((hexStr) => parseInt(hexStr, 16))
      assert.equal(
        Float48.fromBytes(bytes).toString(),
        trial[1]
      )
    })
  })
})
