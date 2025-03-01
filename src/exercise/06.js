// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon
} from '../pokemon'

//class ErrorBoundary extends React.Component{
  //state = {error: null}
  
  //static getDerivedStateFromError(error){
    //return {error}
  //}

  //render(){
    //const {error} = this.state
    //if(error){
      //return <this.props.FallbackComponent error={error} />
    //}
    
    //return this.props.children
  //}
//}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if(!pokemonName){
      return
    }
    setState({
      status: 'pending'
    })
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({
          status: 'resolved',
          pokemon
        })
      },
      error => {
        setState({
          status: 'rejected',
          error
        })
      },
    )
  }, [pokemonName])

  if(status === 'idle'){
    return 'Submit a pokemon'
  }else if(status === 'pending'){
    return <PokemonInfoFallback name={pokemonName} />
  }else if(status === 'rejected'){
    //This will be handled by our error boundary
    throw error
  }else if(status === 'resolved'){
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}){
  return (
    <div role='alert'>
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
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
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
