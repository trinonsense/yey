import React from 'react'
import Search from './Search'
import Options from './Options'
import sample from 'lodash.samplesize'

const SEARCH = 'SEARCH'
const OPTIONS = 'OPTIONS'

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        <section>
          {this.state.pane === SEARCH?
            <Search onResults={this.simplifyOptions.bind(this)} />
          :null}

          {this.state.pane === OPTIONS?
            <Options
              options={this.state.options}
              onSearch={this.openSearch.bind(this)}
            />
          :null}
        </section>
      </div>
    )
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

  openSearch() {
    this.setState({pane: SEARCH})
  }
}
