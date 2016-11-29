/**
 * DataView & jDataView don't provide a way to import 80-bit floats.
 *
 * See: https://en.wikipedia.org/wiki/Extended_precision
 *
 */
const BigNumber = require('bignumber.js')


const EXPONENT_BIAS = 0x3fff
const EXPONENT_RESERVED = 0x7fff


if (!String.prototype.padStart) {
  String.prototype.padStart = require('string.prototype.padstart')
}


class Float80 {
  constructor(is_negative, mantissa, exponent, is_normalized) {
    Object.assign(this, { is_negative, exponent, is_normalized, mantissa })
  }

  static fromBytes(b, littleEndian=false) {
    // Bytes (in big endian):
    // 
    // 9:Seeeeeee 8:eeeeeeee 7:Immmmmmm 6:mmmmmmmm 5:mmmmmmmm
    // 4:mmmmmmmm 3:mmmmmmmm 2:mmmmmmmm 1:mmmmmmmm 0:mmmmmmmm
    //
    // S: sign, e: exponent I: integer, m: mantissa
    //
    // The value of the float is:
    //
    //    (-1) ^ s * 2^(e - 0x3fff) * i.ffffffffff

    if (!littleEndian) { b = Array.from(b).reverse() }

    // 1 bit sign
    var is_negative = Boolean(b[9] & 0x80)

    // 15 bit exponent
    // exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1),
    var exponent = (((b[9] << 1) & 0xff) << 7) | b[8]

    // 1 bit integer/significand part
    var is_normalized = Boolean(b[7] & 0x80)

    // Remove the normalization bit.
    b[7] = b[7] & 0x7f

    // Read and convert the mantissa
    var mantissa_bits = b.slice(0, 8)
        .reverse()
        .map((num) => num.toString(2).padStart(8, '0'))
        .join('')
        .substr(1)

    // 63 bit fraction
    var mantissa = new BigNumber("0." + mantissa_bits, 2)

    return new Float80(is_negative, mantissa, exponent, is_normalized)
  }
  
  asNumber() {
    if (this.exponent === EXPONENT_RESERVED) {
      // NaN or infinity
      return new BigNumber(
        (this.is_negative ? "-":"") +
        (this.mantissa.isZero() ? "Infinity" : "NaN")
      )
    }

    return new BigNumber(this.is_normalized ? 1 : 0)
      .plus(this.mantissa)
      .times(this.is_negative ? -1 : 1)
      .times(new BigNumber(2).pow(this.exponent - EXPONENT_BIAS))
  }

  toString() {
    return this.asNumber()
      .round(Float80.ROUNDING)
      .toString()
  }
}

Float80.ROUNDING = 6

module.exports = Float80