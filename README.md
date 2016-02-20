any-promise backed implementation of promisify

## Installation

```bash
npm install --save any-promisify
```

## Usage

```js
var promisify = require('any-promisify')

// support for simple callbacks
var add = function add(a, b, cb) { cb(null, a + b) };
add = promisify(add)

add(1, 2).then(function (result) {
  console.log(result) // 3
})

// turns asynchronous functions into promised ones
var add = function (a, b) { return a + b }
add = promisify(add)

add(1, 2).then(function (result) {
  console.log(result) // 3
})

// Supports promisify the methods of an object
var obj = {
  add: function(a, b, cb) {
    return cb(null, a + b)
  },
  double: function(a, cb) {
    return this.add(a, a, cb)
  }
}

obj = promisify(obj)
obj.double(2).then(function(doubled) {
  console.log(doubled) // 4
})

```