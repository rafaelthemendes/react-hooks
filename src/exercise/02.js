// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const data = window.localStorage.getItem(key)
    return data ? deserialize(data) : defaultValue
  })

  const prevKey = React.useRef(key)

  React.useEffect(() => {
    if (prevKey.current !== key) {
      window.localStorage.removeItem(prevKey.current)
      prevKey.current = key
    }
    window.localStorage.setItem(key, serialize(state))
  }, [state, key, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
