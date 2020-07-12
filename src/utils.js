export function wrapEvent(...fns) {
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

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isInputEvent(eventOrValue) {
  return isObject(eventOrValue) && isObject(eventOrValue.target)
}
