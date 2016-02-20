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

// Supporst promisify the methods of an object
var obj = {
  add: function(a, b, cb) {
    return cb(null, a + b)
  },
  sub: function(a, b, cb) {
    return cb(null, a - b)
  }
}

obj = promisify(obj)
obj.add(1,2).then(function(sum) {
  console.log(sum) // 3
})

```