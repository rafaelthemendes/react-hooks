// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const statuses = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

const initialState = {
  status: statuses.idle,
  pokemon: null,
  error: null,
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(initialState)

  React.useEffect(() => {
    if (!pokemonName) {
      setState(initialState)
      return
    }

    setState(currentState => ({...currentState, status: statuses.pending}))

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState(currentState => ({
          ...currentState,
          pokemon: pokemonData,
          status: statuses.resolved,
        }))
      })
      .catch(errorData => {
        setState(currentState => ({
          ...currentState,
          error: errorData,
          status: statuses.rejected,
        }))
      })
  }, [pokemonName])

  if (state.status === statuses.idle) {
    return 'Submit a pokemon'
  }

  if (state.status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (state.status === statuses.rejected) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
      </div>
    )
  }

  if (state.status === statuses.resolved) {
    return <PokemonDataView pokemon={state.pokemon} />
  }

  throw new Error('this should be impossible!')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
