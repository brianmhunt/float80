
const BigNumber = require('bignumber.js')

require('./shim')


class Float {
  constructor(is_negative, mantissa, exponent, is_normalized) {
    Object.assign(this, { is_negative, exponent, is_normalized, mantissa })
    this.ROUNDING = 6
  }

  asNumber() {
    if (this.exponent === this.RESERVED) {
      // NaN or infinity
      return new BigNumber(this.reservedNumber())
    }

    return new BigNumber(this.is_normalized ? 1 : 0)
      .plus(this.mantissa)
      .times(this.is_negative ? -1 : 1)
      .times(new BigNumber(2).pow(this.exponent - this.BIAS))
  }

  toString() {
    return this.asNumber()
      .round(this.ROUNDING)
      .toString()
  }
}



module.exports = Float