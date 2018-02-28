import React from 'react'
import request from 'superagent'

export default class Search extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      isLocated: false,
      isLoading: false,
      coords: {
        latitude: 30.38673,
        longitude: -97.7104297
      }
    }

    this.onClick = this.onClick.bind(this)
    this.onLocate = this.onLocate.bind(this)
    this.search = this.search.bind(this)
  }

  render() {
    return (
      <div>
        <h2>Search!</h2>
        <button onClick={this.onClick}>Search</button>
      </div>
    )
  }

  onClick(e) {
    e.preventDefault()

    if (this.state.located) {
      this.search()

    } else {
      if (window.navigator.geolocation) {
        this.setState({isLoading: true})
        window.navigator.geolocation.getCurrentPosition(this.onLocate, this.onLocate, {enableHighAccuracy: true})

      } else {
        this.onLocate()
      }
    }
  }

  onLocate(res) {
    this.setState({isLocated: true})

    if (res && res.coords) {
      this.setState({coords: res.coords}, this.search)
    } else {
      this.search()
    }
  }

  search() {
    this.setState({isLoading: true})
    request
      .get('https://us-central1-yey-y3y.cloudfunctions.net/search')
      .query({
        term: 'restaurant',
        latitude: this.state.coords.latitude,
        longitude: this.state.coords.longitude
      })
      .then(res => console.log(res.body))
      .catch(err => console.error(err.response))
  }
}
