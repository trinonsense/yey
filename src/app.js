import React from 'react'
import ReactDOM from 'react-dom'
import Search from './Search'
import sample from 'lodash.samplesize'

class App extends React.PureComponent {
  render() {
    return (
      <main>
        <Search onResults={this.simplifyOptions.bind(this)} />
      </main>
    )
  }

  constructor() {
    super()

    this.state = {
      options: undefined
    }
  }

  simplifyOptions(results) {
    this.setState({options: sample(results, 3)})
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

