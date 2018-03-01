import React from 'react'
import request from 'superagent'
import PropTypes from 'prop-types'

const DISTANCES = {
  shortwalk: 804,
  walking: 1609,
  biking: 3218,
  driving: 8046
}

const propTypes = {
  onResults: PropTypes.func.isRequired
}

export default class Search extends React.PureComponent {
  render() {
    const {
      isLoading,
      priceFilters
    } = this.state

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Category</label>
            <select onChange={this.updateCategory} value={this.state.category}>
              <option value="restaurants">Restaurants</option>
              <option value="bars">Bars</option>
              <option value="coffee">Coffee Shops</option>
            </select>
          </div>
          <div>
            <label>Distance</label>
            <select onChange={this.updateDistance} value={this.state.distance}>
              <option value="shortwalk">Short Walk (blocks)</option>
              <option value="walking">Walking (1 mi.)</option>
              <option value="biking">Biking (2 mi.)</option>
              <option value="driving">Driving (5 mi.)</option>
            </select>
          </div>
          <div>
            <label>
              $ <input type="checkbox" value="1" onChange={this.filterPrice} checked={~priceFilters.indexOf(1)} />
            </label>
            <label>
              $$ <input type="checkbox" value="2" onChange={this.filterPrice} checked={~priceFilters.indexOf(2)} />
            </label>
            <label>
              $$$ <input type="checkbox" value="3" onChange={this.filterPrice} checked={~priceFilters.indexOf(3)} />
            </label>
            <label>
              $$$$ <input type="checkbox" value="4" onChange={this.filterPrice} checked={~priceFilters.indexOf(4)} />
            </label>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>
    )
  }

  constructor() {
    super()

    this.state = {
      isLocated: false,
      isLoading: false,
      category: 'restaurants',
      distance: 'shortwalk',
      priceFilters: [],
      coords: {
        latitude: 30.38673,
        longitude: -97.7104297
      }
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.search = this.search.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateDistance = this.updateDistance.bind(this)
    this.filterPrice = this.filterPrice.bind(this)
  }

  componentDidMount() {
    this.search()
  }

  onSubmit(e) {
    e.preventDefault()

    if (this.state.isLocated) {
      this.search()

    } else {
      this.locate().then(({coords}) =>
        this.setState({coords, isLocated: true}, this.search)

      ).catch(() =>
        this.setState({isLocated: true}, this.search)
      )
    }
  }

  locate() {
    return new Promise((resolve, reject) => {
      if (!window.navigator.geolocation) return reject()

      console.log('locating...')
      this.setState({isLoading: true})
      window.navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  updateCategory(e) {
    this.setState({category: e.target.value})
  }

  filterPrice(e) {
    const priceFilters = this.state.priceFilters.slice()
    const price = parseInt(e.target.value)

    if (e.target.checked) {
      priceFilters.push(price)

    } else {
      priceFilters.splice(priceFilters.indexOf(price), 1)
    }

    this.setState({priceFilters})
  }

  updateDistance(e) {
    this.setState({distance: e.target.value})
  }

  search() {
    this.setState({isLoading: true})
    console.log('loading...')
    request
      .get('https://us-central1-yey-y3y.cloudfunctions.net/search')
      .query({
        term: this.state.category,
        latitude: this.state.coords.latitude,
        longitude: this.state.coords.longitude,
        price: this.state.priceFilters.join(','),
        radius: DISTANCES[this.state.distance],
        limit: 50,
        open_now: true
      })
      .then(res => {
        this.props.onResults(res.body.businesses)
        this.setState({isLoading: false})
      })
      .catch(err => {
        console.error(err)
        this.setState({isLoading: false})
      })
  }
}

Search.propTypes = propTypes
