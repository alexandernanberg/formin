import 'react-testing-library/cleanup-after-each'
import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import Formin from '..'

function setup({ renderFn, ...props } = {}) {
  function defaultRenderFn({ getFormProps, getInputProps }) {
    return (
      <form {...getFormProps()}>
        <input data-testid="input" {...getInputProps({ name: 'name' })} />
        <select data-testid="select" {...getInputProps({ name: 'pet' })}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
        <button type="submit" data-testid="button" />
      </form>
    )
  }

  let renderArg
  const childrenSpy = jest.fn((controllerArg) => {
    renderArg = controllerArg
    return renderFn || defaultRenderFn(controllerArg)
  })

  const utils = render(<Formin {...props}>{childrenSpy}</Formin>)

  return {
    ...utils,
    renderArg,
    childrenSpy,
    input: utils.queryByTestId('input'),
    button: utils.queryByTestId('button'),
  }
}

test('basic snapshot', () => {
  const { container } = setup()
  expect(container.firstChild).toMatchSnapshot()
})

test('onStateChange called with changes', () => {
  const handleStateChange = jest.fn()
  const { input } = setup({
    onStateChange: handleStateChange,
  })

  fireEvent.change(input, { target: { value: 'Charlie' } })

  expect(handleStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ values: { name: 'Charlie' } }),
  )
})

test('onChange called with changes', () => {
  const handleOnChange = jest.fn()
  const { input } = setup({
    onChange: handleOnChange,
  })

  fireEvent.change(input, { target: { value: 'Charlie' } })

  expect(handleOnChange).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Charlie' }),
  )
})

test('onFocus sets touched', () => {
  const handleStateChange = jest.fn()
  const { input } = setup({
    onStateChange: handleStateChange,
  })

  fireEvent.focus(input)

  expect(handleStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ touched: { name: true } }),
  )
})

// TODO: Check focused element on error (should be first invalid)

// TODO: Controlled vs uncontrolled
