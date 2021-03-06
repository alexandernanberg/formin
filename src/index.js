import PropTypes from 'prop-types'
import { useCallback, useMemo, useRef, useState } from 'react'

function useFormin({
  values: controlledValues,
  defaultValues,
  onChange,
  onSubmit,
  getError,
} = {}) {
  const { current: areValuesControlled } = useRef(controlledValues != null)
  const [stateValues, setValues] = useState(defaultValues || {})
  const [errors, setErrors] = useState({})
  const [touched, setTouchedState] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)

  const values = areValuesControlled ? controlledValues : stateValues

  const reset = useCallback(() => {
    setErrors({})
    setTouchedState({})
    setSubmitting(false)

    if (!areValuesControlled) {
      setValues({})
    }

    if (onChange) {
      onChange({})
    }
  }, [onChange, areValuesControlled])

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setTouched = useCallback((name, fieldTocuhed) => {
    setTouchedState((prev) => ({
      ...prev,
      [name]: fieldTocuhed,
    }))
  }, [])

  const setError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  const stateAndHelpers = useMemo(() => {
    return {
      values,
      errors,
      touched,
      isSubmitting,
      setSubmitting,
      setValue,
      setError,
      setTouched,
      reset,
    }
  }, [
    values,
    errors,
    touched,
    isSubmitting,
    setSubmitting,
    setValue,
    setError,
    setTouched,
    reset,
  ])

  const getInputProps = useCallback(
    ({
      name,
      onInvalid: onInputInvalid,
      onChange: onInputChange,
      onBlur: onInputBlur,
      getError: getInputError,
      ...rest
    } = {}) => {
      const value = values[name] != null ? values[name] : ''
      const error = errors[name]

      return {
        name,
        value,
        'aria-invalid': error != null ? !!error : undefined,
        onChange: wrapEvent(onInputChange, (eventOrValue) => {
          let inputValue
          if (isInputEvent(eventOrValue)) {
            const { target } = eventOrValue
            inputValue = target.value

            if (/number|range/.test(target.type)) {
              const parsed = parseFloat(target.value)
              inputValue = Number.isNaN(parsed) ? '' : parsed
            }

            if (/checkbox/.test(target.type)) {
              inputValue = target.checked
            }
          } else {
            inputValue = eventOrValue
          }

          if (onChange) {
            onChange({ [name]: inputValue })
          }

          if (!areValuesControlled) {
            setValue(name, inputValue)
          }

          if (error) {
            setError(name, undefined)
          }
        }),
        onBlur: wrapEvent(onInputBlur, () => {
          setTouched(name, true)
        }),
        onInvalid: wrapEvent(onInputInvalid, ({ target }) => {
          let message = target.validationMessage

          if (getError) {
            message = getError(target.validity, message)
          }

          if (getInputError) {
            message = getInputError(target.validity, message)
          }

          // Make sure to update errors after the focus event has fired. IE11 will
          // fire the events in a different order.
          setTimeout(() => {
            setError(name, message)
          })
        }),
        ...rest,
      }
    },
    [
      values,
      areValuesControlled,
      errors,
      onChange,
      setValue,
      setError,
      setTouched,
      getError,
    ],
  )

  const getFormProps = useCallback(
    ({ onSubmit: onFormSubmit, ...rest } = {}) => {
      return {
        onSubmit: wrapEvent(onFormSubmit, (event) => {
          event.preventDefault()
          setSubmitting(true)
          onSubmit(stateAndHelpers, event)
        }),
        ...rest,
      }
    },
    [onSubmit, stateAndHelpers],
  )

  const forminBag = useMemo(
    () => ({
      ...stateAndHelpers,
      getInputProps,
      getFormProps,
    }),
    [stateAndHelpers, getInputProps, getFormProps],
  )

  return forminBag
}

function Formin({ children, ...rest }) {
  const formin = useFormin(rest)
  return children(formin)
}

Formin.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({}),
  values: PropTypes.shape({}),
}

function wrapEvent(...fns) {
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

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

function isInputEvent(eventOrValue) {
  return isObject(eventOrValue) && isObject(eventOrValue.target)
}

export { Formin, useFormin }
