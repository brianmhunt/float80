/**
 * 48-bit floating point.
 *
 * You see this with e.g. TurboPascal.
 */

const BigNumber = require('bignumber.js')

const Float = require('./float')


class Float48 extends Float {
  get BIAS() { return 0x81 }
  get RESERVED() { return 0 }

  /**
   * Bytes (in big endian)
   * 
   * 5:Smmmmmmm 4:mmmmmmmm 3:mmmmmmmm 2:mmmmmmmm 1:mmmmmmmm 0:eeeeeeee 
   *
   * e[8]: exponent m[39]: mantissa s[1]:sign
   *
   *  Value: 
   *  
   *      (-1)^s * 2^(e-129) * (1.f)
   *
   * (unless e is reserved)
   */
  static fromBytes(b, littleEndian=false) {
    if (!littleEndian) { b = Array.from(b).reverse() }

    const is_negative = Boolean(b[5] & 0x80)
    b[5] = b[5] & 0x7f
    
    const exponent = b[0]
    
    const mantissa_bits = b.slice(1, 6)
        .reverse()
        .map((num) => num.toString(2).padStart(8, '0'))
        .join('')
        .substr(1)
        
    const mantissa = new BigNumber("0." + mantissa_bits, 2)
    
    return new Float48(is_negative, mantissa, exponent, 1)
  }
  
  reservedNumber() {
    return 0
  }
}

module.exports = Float48