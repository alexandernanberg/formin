# formin

> Primitive for building forms in react

[![npm version](https://badgen.net/npm/v/formin)](https://www.npmjs.com/package/formin)
[![build status](https://badgen.net/travis/alexandernanberg/formin)](https://travis-ci.com/alexandernanberg/formin)
[![license](https://badgen.net/npm/license/formin)](https://www.npmjs.com/package/formin)
[![downloads](https://badgen.net/npm/dm/formin)](https://www.npmjs.com/package/formin)
[![bundle size](https://badgen.net/bundlephobia/minzip/formin)](https://bundlephobia.com/result?p=formin)

## Install

```
$ npm install formin
```

## Usage
```js
// basic usage
import Formin from 'formin'

function MyForm() {
  return (
    <Formin>
      {({ getFormProps, getInputProps }) => (
        <form 
          {...getFormProps({ 
            onSubmit: (event, values) => { 
              console.log(values)  
            } 
          })}
        >
          <input {...getInputProps({ name: 'email', type: 'email' })} />
          <input {...getInputProps({ name: 'password', type: 'password' })} />
          <button>Submit</button>
        </form>
      )}
    </Formin>
  )
}
```

## License

MIT
