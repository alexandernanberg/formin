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
  function defaultRenderFn({ getFormProps, getInputProps, touched }) {
    return (
      <form data-testid="form" {...getFormProps(formProps)}>
        <input
          data-testid="input"
          required
          {...getInputProps({ name: 'text' })}
          data-touched={touched.text}
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

test('should match snapshot', () => {
  const { container } = setup()
  expect(container.firstChild).toMatchSnapshot()
})

test('should call onChange with values', () => {
  const handleOnChange = jest.fn()
  const { input } = setup({
    onChange: handleOnChange,
  })

  fireEvent.change(input, { target: { value: 'Foo' } })

  expect(handleOnChange).toHaveBeenCalledWith(
    expect.objectContaining({ text: 'Foo' }),
  )
})

test('should call onSubmit with stateAndHelpers', () => {
  const onSubmit = jest.fn(({ values }) => values)
  const { renderArg, form } = setup({
    onSubmit,
  })

  const { getInputProps, getFormProps, ...args } = renderArg

  fireEvent.submit(form)

  expect(onSubmit.mock.calls[0][0]).toEqual(args)
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

test('should set touched on field blur', () => {
  const { input } = setup()

  expect(input).not.toHaveAttribute('data-touched')

  fireEvent.blur(input)

  expect(input).toHaveAttribute('data-touched', 'true')
})

test('should set error on field invalid', () => {
  const { form, input } = setup()

  form.checkValidity()

  act(() => {
    jest.runAllTimers()
  })

  expect(input).toHaveAttribute('aria-invalid')
})

test('should clear error on field change', () => {
  const { form, input } = setup()

  act(() => {
    form.checkValidity()
    jest.runAllTimers()
  })

  fireEvent.change(input, { target: { value: 'Foo' } })

  expect(input).not.toHaveAttribute('aria-invalid')
})

test('should work with onChange argument as value', () => {
  const onChange = jest.fn()
  const { custom } = setup({
    onChange,
  })

  fireEvent.change(custom, { target: { value: 'Foo' } })

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ custom: 'Foo' }),
  )
  expect(custom).toHaveAttribute('value', 'Foo')
})

test('should set correct value on checkbox fields', () => {
  const onChange = jest.fn()
  const { checkbox } = setup({
    onChange,
  })

  fireEvent.click(checkbox)

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ checkbox: true }),
  )
})

test('should set correct value on number/range fields', () => {
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

test.todo('can handle arrays')

test.todo('can handle arrays with checkboxes')

test.todo('should set focus on first invalid field on submit')

test.todo('should wrap event')

test.todo('should pass through props in prop getters')
