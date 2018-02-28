import React from 'react'
import request from 'superagent'

export default class Search extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>Search!</h2>
        <button onClick={this.search.bind(this)}>Search</button>
      </div>
    )
  }

  search(e) {
    e.preventDefault()

    request
      .get('https://us-central1-yey-y3y.cloudfunctions.net/search')
      .query({
        term: 'restaurant',
        latitude: 30.2608433,
        longitude: -97.72721
      })
      .then(res => console.log(res.body))
      .catch(err => console.error(err.response))
  }
}
