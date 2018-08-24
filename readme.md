# formin

> Primitive for building forms in react

[![npm](https://badgen.net/npm/v/formin)](https://www.npmjs.com/package/formin)
[![npm](https://badgen.net/npm/license/formin)](https://www.npmjs.com/package/formin)
[![npm](https://badgen.net/npm/dm/formin)](https://www.npmjs.com/package/formin)
[![npm](https://badgen.net/bundlephobia/minzip/formin)](https://bundlephobia.com/result?p=formin)

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
