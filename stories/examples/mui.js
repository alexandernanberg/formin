/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Form from '../../src'

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

      if (formStateAndHelpers.errors[props.name]) {
        inputProps.error = true
        inputProps.helperText = formStateAndHelpers.errors[props.name]
      }

      return inputProps
    },
  })

  render() {
    const { children, ...props } = this.props

    return (
      <Form {...props}>
        {formStateAndHelpers =>
          children(this.getStateAndHelpers(formStateAndHelpers))
        }
      </Form>
    )
  }
}

export default function Mui() {
  return (
    <MuiForm>
      {({ getFormProps, getInputProps, status }) => {
        if (status === Form.stateStatusTypes.success) {
          return (
            <Paper
              style={{
                padding: '24px 32px',
                maxWidth: '320px',
                margin: '0 auto',
              }}
            >
              <Typography variant="headline" component="h3">
                Form submitted
              </Typography>
              <Typography component="p">Lorem ipsum dolor sit amet</Typography>
            </Paper>
          )
        }

        return (
          <form
            action=""
            method="get"
            {...getFormProps({
              onSubmit: (event, stateAndHelpers) => {
                // fake a network request
                setTimeout(() => {
                  stateAndHelpers.setStatus(Form.stateStatusTypes.success)
                }, 2000)
              },
            })}
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
              {status === Form.stateStatusTypes.loading ? (
                <CircularProgress size={32} />
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              )}
            </div>
          </form>
        )
      }}
    </MuiForm>
  )
}
