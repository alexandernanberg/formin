# formin

> Primitive for building forms in react

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
