# float80
Read 80-bit Extended Floating Point Numbers from buffers

It turns out that there does not appear to be any way to read the
[extended precision](https://en.wikipedia.org/wiki/Extended_precision) floating point format in Javascript, aka "long doubles".

Until now, anyway.

#### Get it

Get this library with 

```sh
$ npm install float80
```


#### Usage

```javascript
>>> const Float80 = require('float80')

>>> f = Float80.fromBytes([0x3f, 0xff, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])

>>> f.toString()
1
```

The number parsed by Float80 is stored in a [BigNumber](https://github.com/MikeMcl/bignumber.js/) instance, and exposed by the `asNumber` function.


#### Generating 80 bit floats

Here is a trivial C program that you can use to view how 80-bit floats
are represented:

```c
#include <stdio.h>

union {
  long double value;
  unsigned char bytes[10];
} dc;

int main(int argc, char ** argv) {
  int i;
  while(1) {
      printf("Enter long double: ");
      scanf("%Lf", &dc.value);
      for (i = 0; i < 10; ++i) {
         printf("%02x ", dc.bytes[9 - i]);
      }
      printf("\n");
  }
}
```


#### License

MIT