# formin

> Primitive for building forms in react

[![npm version](https://badgen.net/npm/v/formin)](https://www.npmjs.com/package/formin)
[![build status](https://badgen.net/travis/alexandernanberg/formin)](https://travis-ci.org/alexandernanberg/formin)
[![license](https://badgen.net/npm/license/formin)](https://www.npmjs.com/package/formin)
[![downloads](https://badgen.net/npm/dm/formin)](https://www.npmjs.com/package/formin)
[![bundle size](https://badgen.net/bundlephobia/minzip/formin)](https://bundlephobia.com/result?p=formin)

## Inspiration
This library wouldn't exist if it weren't for [Downshift](https://github.com/paypal/downshift) and [Formik](https://github.com/jaredpalmer/formik), so big shoutout to them. 

## Install

```
$ npm install formin
```

You can also [try it out in CodeSandbox.io](https://codesandbox.io/s/mj1jr59nxp) before commiting to anything.

## Usage
```js
// basic usage
import Formin from 'formin'

function MyForm() {
  return (
    <Formin onSubmit={({ values }) => { console.log(values) }}>
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

### Props

#### `children`

#### `values`

#### `defaultValues`

#### `onChange`

#### `onStateChange`

#### `stateReducer`

## License

MIT
