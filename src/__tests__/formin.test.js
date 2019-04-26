import React, { StrictMode } from 'react'
import { render, fireEvent, act } from 'react-testing-library'
import 'jest-dom/extend-expect'
import { Formin } from '..'

jest.useFakeTimers()

function setup({ renderFn, formProps, ...props } = {}) {
  function defaultRenderFn({ getFormProps, getInputProps }) {
    return (
      <form data-testid="form" {...getFormProps(formProps)}>
        <input
          data-testid="input"
          required
          {...getInputProps({ name: 'name' })}
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
  const childrenSpy = jest.fn(controllerArg => {
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

test('onSubmit called with stateAndHelpers', () => {
  const onSubmit = jest.fn(({ values }) => values)
  const { renderArg, form } = setup({
    onSubmit,
  })

  const { getInputProps, getFormProps, ...args } = renderArg

  fireEvent.submit(form)

  expect(onSubmit.mock.calls[0][0]).toEqual(args)
})

test.skip('onFocus sets touched', () => {
  const handleStateChange = jest.fn()
  const { input } = setup({
    onStateChange: handleStateChange,
  })

  fireEvent.focus(input)

  expect(handleStateChange).toHaveBeenCalledWith(
    expect.objectContaining({ touched: { name: true } }),
  )
})

test('can be controlled', () => {
  const onChange = jest.fn()
  const { input } = setup({ onChange, values: { name: 'Alex' } })

  expect(input.value).toEqual('Alex')

  fireEvent.change(input, { target: { value: 'Charlie' } })

  expect(onChange).toHaveBeenCalledWith({ name: 'Charlie' })
})

test('can reset', () => {
  const { input, renderArg } = setup({ defaultValues: { name: 'Alex' } })

  expect(input.value).toEqual('Alex')

  act(() => {
    renderArg.reset()
  })

  expect(input.value).toEqual('')
})

test('sets error onInvalid', () => {
  const { form, input } = setup()

  form.checkValidity()

  act(() => {
    jest.runAllTimers()
  })

  expect(input).toHaveAttribute('aria-invalid')
})

test('clear error onChange', () => {
  const { form, input } = setup()

  act(() => {
    form.checkValidity()
    jest.runAllTimers()
  })

  fireEvent.change(input, { target: { value: 'Charlie' } })

  expect(input).not.toHaveAttribute('aria-invalid')
})

test('set correct checkbox value', () => {
  const onChange = jest.fn()
  const { checkbox } = setup({
    onChange,
  })

  fireEvent.click(checkbox)

  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ toys: true }))
})

test('should work in StrictMode without warnings', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <StrictMode>
      <Formin>
        {({ getFormProps, getInputProps }) => (
          <form {...getFormProps()}>
            <input type="text" {...getInputProps({ name: 'input' })} />
          </form>
        )}
      </Formin>
    </StrictMode>,
  )

  expect(spy).not.toHaveBeenCalled()
})

// TODO: Check focused element on error (should be first invalid)
