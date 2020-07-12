# formin

> Primitive for building forms in react

[![npm version](https://badgen.net/npm/v/formin)](https://www.npmjs.com/package/formin)
![Publish package](https://github.com/alexandernanberg/formin/workflows/Publish%20package/badge.svg)
[![code coverage](https://badgen.net/codecov/c/github/alexandernanberg/formin)](https://codecov.io/gh/alexandernanberg/formin)
[![license](https://badgen.net/npm/license/formin)](https://www.npmjs.com/package/formin)
[![downloads](https://badgen.net/npm/dm/formin)](https://www.npmjs.com/package/formin)
[![bundle size](https://badgen.net/bundlephobia/minzip/formin)](https://bundlephobia.com/result?p=formin)
[![semantic-release](https://badgen.net/badge/%F0%9F%93%A6%F0%9F%9A%80/semantic%20release/e10079)](https://github.com/semantic-release/semantic-release)

I built formin to serve as a tiny (~1.5kb) alternative to other form solutions in react with these goals in mind

- Simple API
- Tiny size
- Work great with native HTML form validation
- Great a11y support
- Extendable

## Install

```
$ npm install formin
```

You can also [play around with it in CodeSandbox.io](https://codesandbox.io/s/mj1jr59nxp).

## Usage

### Hook

```js
import { useFormin } from 'formin'

function Form() {
  const { getInputProps, getFormProps } = useFormin({
    onSubmit: ({ values }) => {
      console.log(values)
    },
  })

  return (
    <form {...getFormProps()}>
      <input {...getInputProps({ name: 'foo' })} />
      <input {...getInputProps({ name: 'bar' })} />
      <button>Submit</button>
    </form>
  )
}
```

### Render prop

```js
import { Formin } from 'formin'

function MyForm() {
  return (
    <Formin
      onSubmit={({ values }) => {
        console.log(values)
      }}
    >
      {({ getFormProps, getInputProps }) => (
        <form {...getFormProps()}>
          <input {...getInputProps({ name: 'foo' })} />
          <input {...getInputProps({ name: 'bar' })} />
          <button>Submit</button>
        </form>
      )}
    </Formin>
  )
}
```

## Other solutions

This library is heavily inspired by [Formik](https://github.com/jaredpalmer/formik) but takes a different approach to the problem.

## License

[MIT](./license)
