/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import Form from '../../src'

export default function Basic() {
  return (
    <Form
      onStateChange={(changes) => {
        console.log(changes)
      }}
    >
      {({ getFormProps, getInputProps, status }) => (
        <form
          method="get"
          {...getFormProps({
            onChange: (event, stateAndHelpers) => {
              console.log(event, stateAndHelpers)
            },
          })}
        >
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...getInputProps({ name: 'name' })}
              required
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              id="adddress"
              type="text"
              {...getInputProps({ name: 'address' })}
            />
          </div>
          <div>
            <button type="submit">Submit</button>
            {status === Form.stateStatusTypes.loading && <p>Loading...</p>}
          </div>
        </form>
      )}
    </Form>
  )
}
