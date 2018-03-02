import React from 'react'
import Search from './Search'
import Options from './Options'
import sample from 'lodash.samplesize'
import styled from 'styled-components'

const SEARCH = 'SEARCH'
const OPTIONS = 'OPTIONS'

export default class App extends React.PureComponent {
  render() {
    return (
      <Container>
        <AppSearch fullWidth={this.state.options}>
          <Search
            fullWidth={this.state.options}
            onResults={this.simplifyOptions.bind(this)}
          />
        </AppSearch>

        <Options options={this.state.options} />
      </Container>
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
}

const Container = styled.div`
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
`

const AppSearch = styled.div`
  max-width: ${({fullWidth}) => fullWidth? 'auto' : '450px'};
  margin-left: auto;
  margin-right: auto;

  .section {
    padding-bottom: 0;
  }
`
