import React from 'react'
import PropTypes from 'prop-types'
import {
  noop,
  isEmptyObject,
  isFunction,
  composeEventHandlers,
  requiredProp,
} from './utils'

function defaultStateReducer(state, stateToSet) {
  return stateToSet
}

export default class Formin extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onStateChange: PropTypes.func,
    stateReducer: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func]).isRequired,
    /* eslint-disable react/require-default-props */
    defaultValues: PropTypes.shape({}),
    values: PropTypes.shape({}),
    /* eslint-enable react/require-default-props */
  }

  static defaultProps = {
    onChange: noop,
    onSubmit: noop,
    onStateChange: noop,
    stateReducer: defaultStateReducer,
  }

  static stateChangeTypes = {
    onChange: '__change__',
    onFocus: '__focus__',
    onInvalid: '__invalid__',
  }

  static stateStatusTypes = {
    success: '__success__',
    error: '__error__',
    loading: '__loading__',
    default: '__default__',
  }

  state = {
    /* eslint-disable react/no-unused-state */
    values: this.props.defaultValues || {},
    errors: {},
    touched: {},
    status: Formin.stateStatusTypes.default,
    /* eslint-enable react/no-unused-state */
  }

  isControlledProp(key) {
    const { [key]: prop } = this.props
    return prop != null
  }

  internalSetState = (changes, callback) => {
    let stateChanges

    this.setState(
      (prevState) => {
        const { stateReducer } = this.props
        const state = this.getState(prevState)
        const changesObject = stateReducer(
          state,
          isFunction(changes) ? changes(state) : changes,
        )
        const { type, ...onlyChanges } = changesObject

        stateChanges = changesObject

        const nonControlledProps = Object.entries(onlyChanges).reduce(
          (newChanges, [key, value]) => {
            if (!this.isControlledProp(key)) {
              return {
                ...newChanges,
                [key]: value,
              }
            }

            return newChanges
          },
          {},
        )

        return !isEmptyObject(nonControlledProps) ? nonControlledProps : null
      },
      () => {
        const { onChange, onStateChange } = this.props
        if (isFunction(callback)) {
          callback()
        }

        if (Object.prototype.hasOwnProperty.call(stateChanges, 'values')) {
          onChange(stateChanges.values)
        }

        onStateChange(stateChanges)
      },
    )
  }

  getState(stateToMerge = this.state) {
    return Object.entries(stateToMerge).reduce(
      (combinedState, [key, value]) => {
        const { [key]: propValue } = this.props

        return {
          ...combinedState,
          [key]: this.isControlledProp(key) ? propValue : value,
        }
      },
      {},
    )
  }

  getStateAndHelpers() {
    const { values, errors, status } = this.getState()

    return {
      values,
      errors,
      status,
      getFormProps: this.getFormProps,
      getInputProps: this.getInputProps,
      setStatus: this.setStatus,
      setState: this.internalSetState,
    }
  }

  setStatus = (status) => {
    this.internalSetState({ status })
  }

  getField = (name) => {
    const { values, errors } = this.getState()

    return {
      value: values[name] != null ? values[name] : '',
      error: errors[name] || false,
    }
  }

  getInputProps = ({
    name = requiredProp('getInputProps', 'name'),
    onInvalid,
    onChange,
    onFocus,
    onKeyPress,
    ...rest
  } = {}) => {
    const field = this.getField(name)

    return {
      name,
      value: field.value,
      'aria-invalid': !!field.error,
      onKeyPress: composeEventHandlers(
        onKeyPress,
        /* istanbul ignore next (can't reasonably test this) */ (event) => {
          const { target, key } = event

          // Only allow numbers in type="number" inputs. This is necessary
          // because Firefox allows other values and this causes the
          // input to become an uncontrolled component.
          if (target.type === 'number' && !/^[0-9]*$/.test(key)) {
            event.preventDefault()
          }
        },
      ),
      onChange: composeEventHandlers(onChange, (event) => {
        const { target } = event
        const value = target.type === 'checkbox' ? target.checked : target.value

        this.internalSetState(({ values, errors }) => {
          const stateToSet = {
            type: Formin.stateChangeTypes.onChange,
            values: {
              ...values,
              [name]: value,
            },
          }

          if (field.error) {
            stateToSet.errors = {
              ...errors,
              [name]: false,
            }
          }

          return stateToSet
        })
      }),
      onFocus: composeEventHandlers(onFocus, () => {
        this.internalSetState(({ touched }) => {
          const stateToSet = {
            type: Formin.stateChangeTypes.onFocus,
            touched: {
              ...touched,
              [name]: true,
            },
          }

          return stateToSet
        })
      }),
      onInvalid: composeEventHandlers(onInvalid, (event) => {
        const { target } = event
        // Make sure to update state after the focus event has fired. This is
        // necessary because IE11 will fire the events in another order.
        setTimeout(() => {
          this.internalSetState(({ errors }) => ({
            type: Formin.stateChangeTypes.onInvalid,
            errors: {
              ...errors,
              [name]: target.validationMessage,
            },
          }))
        })
      }),
      ...rest,
    }
  }

  getFormProps = ({ onSubmit = noop } = {}) => {
    const stateAndHelpers = this.getStateAndHelpers()

    return {
      onSubmit: composeEventHandlers(onSubmit, (event) => {
        event.preventDefault()
        this.setStatus(Formin.stateStatusTypes.loading)
        this.props.onSubmit(stateAndHelpers, event)
      }),
    }
  }

  render() {
    const { children } = this.props
    const stateAndHelpers = this.getStateAndHelpers()

    return children(stateAndHelpers)
  }
}
