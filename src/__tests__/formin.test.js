import React, { StrictMode } from 'react'
import { render, fireEvent, act } from 'react-testing-library'
import 'jest-dom/extend-expect'
import { Formin } from '..'

jest.useFakeTimers()

function CustomInput({ onChange = () => {}, ...props }) {
  return (
    <input
      type="text"
      onChange={({ target }) => {
        onChange(target.value)
      }}
      {...props}
    />
  )
}

function setup({ renderFn, formProps, ...props } = {}) {
  function defaultRenderFn({ getFormProps, getInputProps }) {
    return (
      <form data-testid="form" {...getFormProps(formProps)}>
        <input
          data-testid="input"
          required
          {...getInputProps({ name: 'text' })}
        />
        <input
          type="number"
          data-testid="number"
          {...getInputProps({ name: 'number' })}
        />
        <select data-testid="select" {...getInputProps({ name: 'select' })}>
          <option value="foo">Foo</option>
          <option value="bar">Bar</option>
        </select>
        <input
          data-testid="checkbox"
          type="checkbox"
          {...getInputProps({ name: 'checkbox' })}
        />
        <input
          data-testid="range"
          type="range"
          {...getInputProps({ name: 'range' })}
        />
        <CustomInput
          data-testid="custom"
          {...getInputProps({ name: 'custom' })}
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
    range: utils.queryByTestId('range'),
    custom: utils.queryByTestId('custom'),
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

  fireEvent.change(input, { target: { value: 'Foo' } })

  expect(handleOnChange).toHaveBeenCalledWith(
    expect.objectContaining({ text: 'Foo' }),
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
    expect.objectContaining({ touched: { text: true } }),
  )
})

test('can be controlled', () => {
  const onChange = jest.fn()
  const { input } = setup({ onChange, values: { text: 'Foo' } })

  expect(input.value).toEqual('Foo')

  fireEvent.change(input, { target: { value: 'Bar' } })

  expect(onChange).toHaveBeenCalledWith({ text: 'Bar' })
})

test('can reset', () => {
  const onChange = jest.fn()
  const { input, renderArg } = setup({
    defaultValues: { text: 'Foo' },
    onChange,
  })

  expect(input.value).toEqual('Foo')

  act(() => {
    renderArg.reset()
  })

  expect(input.value).toEqual('')
  expect(onChange).toHaveBeenCalledWith({})
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

  fireEvent.change(input, { target: { value: 'Foo' } })

  expect(input).not.toHaveAttribute('aria-invalid')
})

test('can handle onChange argument as value', () => {
  const onChange = jest.fn()
  const { custom } = setup({
    onChange,
  })

  fireEvent.change(custom, { target: { value: 'Foo' } })

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ custom: 'Foo' }),
  )
})

test('set correct checkbox value', () => {
  const onChange = jest.fn()
  const { checkbox } = setup({
    onChange,
  })

  fireEvent.click(checkbox)

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ checkbox: true }),
  )
})

test('set correct number and range value', () => {
  const onChange = jest.fn()
  const { number, range } = setup({
    onChange,
  })

  fireEvent.change(number, { target: { value: 1 } })
  fireEvent.change(range, { target: { value: 5 } })

  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ number: 1 }))
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ range: 5 }))
})

test('should work in StrictMode without warnings', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <StrictMode>
      <Formin>
        {({ getFormProps, getInputProps }) => (
          <form {...getFormProps()}>
            <input type="text" {...getInputProps({ text: 'input' })} />
          </form>
        )}
      </Formin>
    </StrictMode>,
  )

  expect(spy).not.toHaveBeenCalled()
})

// TODO: Check focused element on error (should be first invalid)
