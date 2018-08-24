import 'react-testing-library/cleanup-after-each'
import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import Formin from '..'

jest.useFakeTimers()

function setup({ renderFn, formProps, ...props } = {}) {
  function defaultRenderFn({ getFormProps, getInputProps }) {
    return (
      <form data-testid="form" {...getFormProps(formProps)}>
        <input
          data-testid="input"
          {...getInputProps({ name: 'name' })}
          required
        />
        <input
          type="number"
          data-testid="number"
          {...getInputProps({ name: 'age' })}
        />
        <select data-testid="select" {...getInputProps({ name: 'pet' })}>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
        <input
          data-testid="checkbox"
          type="checkbox"
          {...getInputProps({ name: 'toys' })}
        />
        <button type="submit" data-testid="button" />
      </form>
    )
  }

  let renderArg
  const children = renderFn || defaultRenderFn
  const childrenSpy = jest.fn((controllerArg) => {
    renderArg = controllerArg
    return children(controllerArg)
  })

  const utils = render(<Formin {...props}>{childrenSpy}</Formin>)

  return {
    ...utils,
    renderArg,
    childrenSpy,
    form: utils.queryByTestId('form'),
    input: utils.queryByTestId('input'),
    number: utils.queryByTestId('number'),
    checkbox: utils.queryByTestId('checkbox'),
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

test('getFormProps onSubmit is called', () => {
  const onSubmit = jest.fn(({ values }) => values)
  const { renderArg, form } = setup({
    formProps: {
      onSubmit,
    },
  })

  fireEvent.submit(form)

  expect(onSubmit.mock.calls[0][0]).toEqual(renderArg)
})

test('works when controlled', () => {
  const onChange = jest.fn()
  const { input } = setup({ onChange, values: { name: 'Alex' } })

  expect(input.value).toEqual('Alex')

  fireEvent.change(input, { target: { value: 'Charlie' } })

  expect(onChange).toHaveBeenCalledWith({ name: 'Charlie' })
})

test('sets error state when invalid', () => {
  const onStateChange = jest.fn()
  const { form } = setup({ onStateChange })

  form.checkValidity()
  jest.runAllTimers()

  expect(onStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ errors: { name: 'Constraints not satisfied' } }),
  )
})

test('clears error on input change', () => {
  const onStateChange = jest.fn()
  const { form, input } = setup({ onStateChange })

  form.checkValidity()
  jest.runAllTimers()

  fireEvent.change(input, { target: { value: 'Charlie' } })

  expect(onStateChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      errors: {
        name: false,
      },
    }),
  )
})

test('calls setInternalState callback', () => {
  const callback = jest.fn()
  const { renderArg } = setup()

  renderArg.setState({ values: { name: 'Fido' } }, callback)

  expect(callback).toHaveBeenCalled()
})

test('throws if name is not provided to getInputProps', () => {
  expect(() =>
    setup({
      renderFn: ({ getInputProps }) => <input {...getInputProps()} />,
    }),
  ).toThrow()
})

// TODO: Check focused element on error (should be first invalid)
