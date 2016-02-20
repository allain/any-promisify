var Promise = require('any-promise')
var getParamNames = require('get-parameter-names')

function promisify (fn, context) {
  if (typeof fn === 'object')
    return promisifyAll(fn)

  var paramNames = getParamNames(fn)

  var callbacked = ['cb', 'callback', 'done'].indexOf(paramNames[paramNames.length - 1]) !== -1

  return function () {
    var args = Array.prototype.splice.call(arguments, 0)

    return new Promise(
      callbacked ?
        callbackHandler :
        synchronousHandler
    )

    function callbackHandler(resolve, reject) {
      fn.apply(context, args.concat(function (err, result) {
        return err ? reject(err) : resolve(result)
      }))
    }

    function synchronousHandler(resolve, reject) {
      try {
        resolve(fn.apply(context, args))
      } catch (e) {
        reject(e)
      }
    }
  }
}

function promisifyAll(obj) {
  if (Array.isArray(obj))
    throw new Error('promisify does not make sense on Arrays')

  var result = {}

  Object.keys(obj).forEach(function(field) {
    var val = obj[field]

    result[field] = typeof val === 'function' ? promisify(val, obj) : val
  })

  return result
}

module.exports = promisify
