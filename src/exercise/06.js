// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

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

  const {status, pokemon, error} = state

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

  if (status === statuses.idle) {
    return 'Submit a pokemon'
  }

  if (status === statuses.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }

  if (status === statuses.resolved) {
    return <PokemonDataView pokemon={pokemon} />
  }

  if (status === statuses.rejected) {
    throw error
  }

  throw new Error('this should be impossible!')
}

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          resetKeys={[pokemonName]}
          onReset={handleReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
