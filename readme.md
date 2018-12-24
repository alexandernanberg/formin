# formin

> Primitive for building forms in react

[![npm version](https://badgen.net/npm/v/formin)](https://www.npmjs.com/package/formin)
[![build status](https://badgen.net/travis/alexandernanberg/formin)](https://travis-ci.org/alexandernanberg/formin)
[![code coverage](https://badgen.net/codecov/c/github/alexandernanberg/formin)](https://codecov.io/gh/alexandernanberg/formin)
[![license](https://badgen.net/npm/license/formin)](https://www.npmjs.com/package/formin)
[![downloads](https://badgen.net/npm/dm/formin)](https://www.npmjs.com/package/formin)
[![bundle size](https://badgen.net/bundlephobia/minzip/formin)](https://bundlephobia.com/result?p=formin)
[![semantic-release](https://badgen.net/badge/%F0%9F%93%A6%F0%9F%9A%80/semantic%20release/e10079)](https://github.com/semantic-release/semantic-release)

I built formin to serve as a tiny (~2kb) alternative to other form solutions in react with these goals in mind;

- Be as declarative as possible
- Work great with native HTML form validation
- Tiny footprint
- Extendable

## Inspiration

This library is heavily inspired by [Downshift](https://github.com/paypal/downshift) and [Formik](https://github.com/jaredpalmer/formik) and wouldn't exist without them – so big shout-out to them both.

## Install

```
$ npm install formin
```

You can also [play with it in CodeSandbox.io](https://codesandbox.io/s/mj1jr59nxp).

## Usage

```js
import Formin from 'formin'

function MyForm() {
  return (
    <Formin
      onSubmit={({ values }) => {
        console.log(values)
      }}
    >
      {({ getFormProps, getInputProps }) => (
        <form {...getFormProps()}>
          <input {...getInputProps({ name: 'email', type: 'email' })} />
          <input {...getInputProps({ name: 'password', type: 'password' })} />
          <button>Submit</button>
        </form>
      )}
    </Formin>
  )
}
```

## [Docs](https://formin.netlify.com/)

## License

MIT
