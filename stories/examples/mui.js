/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Formin from '../../src'

class MuiForm extends React.Component {
  getStateAndHelpers = formStateAndHelpers => ({
    ...formStateAndHelpers,
    getInputProps: (props) => {
      const inputProps = formStateAndHelpers.getInputProps({
        ...props,
        onInvalid: (event) => {
          event.preventDefault()
          const { target: field } = event
          const { activeElement } = document

          if (
            !activeElement.validity ||
            (activeElement.validity && activeElement.validity.valid)
          ) {
            field.focus()
          }
        },
      })

      const error = formStateAndHelpers.errors[props.name]

      if (error) {
        inputProps.error = true
        inputProps.helperText = error
      }

      return inputProps
    },
  })

  render() {
    const { children, ...props } = this.props

    return (
      <Formin {...props}>
        {formStateAndHelpers =>
          children(this.getStateAndHelpers(formStateAndHelpers))
        }
      </Formin>
    )
  }
}

export default function Mui() {
  return (
    <MuiForm
      onSubmit={({ values, setSubmitting }) => {
        console.log(values)
        // fake a network request
        setTimeout(() => {
          setSubmitting(false)
        }, 2000)
      }}
    >
      {({ getFormProps, getInputProps, isSubmitting }) => (
        <form
          {...getFormProps()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '320px',
            margin: '0 auto',
          }}
        >
          <TextField
            id="name"
            label="Name"
            margin="normal"
            required
            {...getInputProps({ name: 'name' })}
          />
          <TextField
            id="address"
            label="Address"
            margin="normal"
            {...getInputProps({ name: 'address' })}
          />
          <div style={{ marginTop: '24px' }}>
            {isSubmitting ? (
              <CircularProgress size={32} />
            ) : (
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            )}
          </div>
        </form>
      )}
    </MuiForm>
  )
}
