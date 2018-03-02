import React from 'react'
import Search from './Search'
import Options from './Options'
import sample from 'lodash.samplesize'

const SEARCH = 'SEARCH'
const OPTIONS = 'OPTIONS'

export default class App extends React.PureComponent {
  render() {
    return [
      <Search
        key="search"
        onResults={this.simplifyOptions.bind(this)}
      />,

      <Options
        key="options"
        options={this.state.options}
      />
    ]
  }

  constructor() {
    super()

    this.state = {
      options: undefined,
      pane: SEARCH
    }
  }

  simplifyOptions(results) {
    this.setState({
      pane: OPTIONS,
      options: sample(results, 3)
    })
  }
}
