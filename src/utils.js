export function noop() {}

export function composeEventHandlers(...fns) {
  return (event, ...args) =>
    fns.some((fn) => {
      if (fn) {
        fn(event, ...args)
      }
      return (
        event.preventForminDefault ||
        (Object.prototype.hasOwnProperty.call(event, 'nativeEvent') &&
          event.nativeEvent.preventForminDefault)
      )
    })
}

export function requiredProp(fnName, propName) {
  throw new Error(`The property "${propName}" is required in "${fnName}"`)
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

export function isFunction(maybe) {
  return typeof maybe === 'function'
}
