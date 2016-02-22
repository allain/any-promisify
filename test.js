var test = require('blue-tape')
var Promise = require('any-promise')

var promisify = require('.')

test('returns a function when passed a function', function(t) {
  t.equal(typeof promisify(function() {}), 'function', 'expected function to be returned')
  t.end();
})

test('returned function resolves when call function succeeds without result', function(t) {
  var pf = promisify(function(cb) { cb(null) });

  return pf().then(function(result) {
    t.equal(typeof result, 'undefined', 'expect undefined')
  })
})

test('returned function resolves when call function succeeds with result', function(t) {
  var pf = promisify(function(cb) { cb(null, 'yay!') });

  return pf().then(function(result) {
    t.equal(result, 'yay!', 'expect to resolve to callback result')
  })
})

test('returned function properfly deals with arguments', function(t) {
  var add = function(a, b, cb) { cb(null, a + b) }

  var pf = promisify(add)

  return pf(1, 2).then(function(result) {
    t.equal(result, 3, 'expect to sum to 3')
  })
})

test('turns synchronous functions into promised ones', function(t) {
  var add = function(a, b) { return a + b; }
  var pf = promisify(add)

  return pf(1,2).then(function(result) {
    t.equal(result, 3, 'expect to sum to 3')
  })
})

test('resolves to undefined when synchronous function returns undefined', function(t) {
  var noop = function() {}

  var pf = promisify(noop)

  return pf().then(function(result) {
    t.equal(typeof result, 'undefined', 'expected to resolve to undefined')
  })
})

test('rejects promise when callback errors', function(t) {
  var boo = function(cb) {
    cb(new Error('BOO!'))
  }

  var pf = promisify(boo)

  return pf().then(function() {
    t.fail('should not get here')
  }, function(err) {
    t.ok(err instanceof Error, 'expected Error object')
  })
})

test('promisifies all methods on passed object', function(t) {
  var obj = {
    add: function(a, b, cb) {
      cb(null, a + b)
    },
    err: function(cb) {
      cb(new Error('error'))
    },
    num: 10,
    arr: [1, 2, 3]
  }

  var pobj = promisify(obj)

  t.equal(pobj.num, 10, 'simple num prop unchanged')
  t.deepEqual(pobj.arr, [1, 2, 3], 'arrays are untouched')

  pobj.add(1,2).then(function(sum) {
    t.equal(3, sum, 'promisifed method worked')

    pobj.err().catch(function(err) {
      t.ok(err instanceof Error)
      t.end()
    })
  })
})

test('promisified objects have "this" methods available to them', function(t) {
  var obj = {
    add: function(a, b, cb) {
      cb(null, a + b)
    },
    double: function(a, cb) {
      this.add(a, a, cb)
    }
  }

  var pobj = promisify(obj)
  return Promise.all([
    pobj.add(1, 2),
    pobj.double(2)
  ]).then(function(results) {
    t.equal(results[0], 3);
    t.equal(results[1], 4);
  })
})

test('promisified objects have methods defined in prototype chain', function(t) {
  function A() {

  }

  A.prototype.echo = function(val, cb) {
    cb(null, val)
  }

  var a = new A()
  a = promisify(a)

  return a.echo(10).then(function(val) {
    t.equal(val, 10)
  })
})