import React from 'react'
import ReactDOM from 'react-dom'
import Search from './search'

class App extends React.PureComponent {
  render() {
    return (
      <main>
        <h1>Yey!</h1>
        <Search />
      </main>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

