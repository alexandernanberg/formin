import { useRef, useMemo, useState, useCallback } from 'react'
import { wrapEvent } from './utils'

export default function useFormin({
  values: controlledValues,
  defaultValues,
  onChange,
  onSubmit,
} = {}) {
  const [values, setValues] = useState(defaultValues || {})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { current: areValuesControlled } = useRef(controlledValues != null)

  /* Utils */

  const reset = useCallback(() => {
    setValues({})
    setErrors({})
  }, [])

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setError = useCallback((name, value) => {
    setErrors(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const stateAndHelpers = useMemo(() => {
    return {
      values,
      errors,
      isSubmitting,
      setIsSubmitting,
      setValue,
      setError,
      reset,
    }
  }, [values, errors, isSubmitting, setIsSubmitting, setValue, setError, reset])

  /* Prop getters */

  const getInputProps = ({
    name,
    onInvalid: onInputInvalid,
    onChange: onInputChange,
    ...rest
  } = {}) => {
    const value =
      (areValuesControlled ? controlledValues[name] : values[name]) || ''
    const error = errors[name]

    return {
      name,
      value,
      'aria-invalid': error != null ? !!error : undefined,
      onChange: wrapEvent(onInputChange, ({ target }) => {
        const inputValue =
          target.type === 'checkbox' ? target.checked : target.value

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
      onInvalid: wrapEvent(onInputInvalid, ({ target }) => {
        const { validationMessage, validity } = target
        // Make sure to update state after the focus event has fired. This is
        // necessary because IE11 will fire the events in another order.
        setTimeout(() => {
          setError(name, { validationMessage, validity })
        })
      }),
      ...rest,
    }
  }

  const getFormProps = ({ onSubmit: onFormSubmit, ...rest } = {}) => {
    return {
      onSubmit: wrapEvent(onFormSubmit, event => {
        event.preventDefault()
        setIsSubmitting(true)
        onSubmit(stateAndHelpers, event)
      }),
      ...rest,
    }
  }

  return {
    ...stateAndHelpers,
    getInputProps,
    getFormProps,
  }
}
