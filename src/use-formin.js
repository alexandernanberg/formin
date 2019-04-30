import { useRef, useMemo, useState, useCallback } from 'react'
import { wrapEvent, isInputEvent } from './utils'

export default function useFormin({
  values: controlledValues,
  defaultValues,
  onChange,
  onSubmit,
} = {}) {
  const [values, setValues] = useState(defaultValues || {})
  const [errors, setErrors] = useState({})
  const [touched, setTouchedState] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { current: areValuesControlled } = useRef(controlledValues != null)

  /* Utils */

  const reset = useCallback(() => {
    setValues({})
    setErrors({})
    setTouchedState({})

    if (onChange) {
      onChange({})
    }
  }, [onChange])

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setTouched = useCallback((name, fieldTocuhed) => {
    setTouchedState(prev => ({
      ...prev,
      [name]: fieldTocuhed,
    }))
  }, [])

  const setError = useCallback((name, error) => {
    setErrors(prev => ({
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
      setIsSubmitting,
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
    setIsSubmitting,
    setValue,
    setError,
    setTouched,
    reset,
  ])

  /* Prop getters */

  const getInputProps = useCallback(
    ({
      name,
      onInvalid: onInputInvalid,
      onChange: onInputChange,
      onBlur: onInputBlur,
      ...rest
    } = {}) => {
      const value =
        (areValuesControlled ? controlledValues[name] : values[name]) || ''
      const error = errors[name]

      return {
        name,
        value,
        'aria-invalid': error != null ? !!error : undefined,
        onChange: wrapEvent(onInputChange, eventOrValue => {
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
            setError(name, null)
          }
        }),
        onBlur: wrapEvent(onInputBlur, () => {
          setTouched(name, true)
        }),
        onInvalid: wrapEvent(onInputInvalid, ({ target }) => {
          const { validationMessage, validity } = target
          // Make sure to update errors after the focus event has fired. IE11 will
          // fire the events in a different order.
          setTimeout(() => {
            setError(name, { validationMessage, validity })
          })
        }),
        ...rest,
      }
    },
    [
      values,
      controlledValues,
      areValuesControlled,
      errors,
      onChange,
      setValue,
      setError,
      setTouched,
    ],
  )

  const getFormProps = useCallback(
    ({ onSubmit: onFormSubmit, ...rest } = {}) => {
      return {
        onSubmit: wrapEvent(onFormSubmit, event => {
          event.preventDefault()
          setIsSubmitting(true)
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
