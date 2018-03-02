import React from 'react'
import request from 'superagent'
import cx from 'classnames'
import repeat from 'lodash.repeat'

const DISTANCES = {
  walking: 1609,
  biking: 3218,
  driving: 8046
}

export default class Search extends React.PureComponent {
  render() {
    const {isLoading} = this.state

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
              <option value="walking">Walking (1 mi.)</option>
              <option value="biking">Biking (2 mi.)</option>
              <option value="driving">Driving (5 mi.)</option>
            </select>
          </div>
          <div>
            <h3>Prices</h3>
            <div className="buttons has-addons">
              {Search.PRICES.map(id =>
                <Price
                  key={id}
                  id={id}
                  onClick={this.filterPrice}
                  selected={~this.state.priceFilters.indexOf(id)}
                />
              )}
            </div>
          </div>
          <button className={cx('button', {'is-loading':isLoading})} disabled={isLoading} type="submit">
            Search
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
      distance: 'walking',
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
    e.preventDefault()
    const priceFilters = this.state.priceFilters.slice()
    const price = parseInt(e.target.value)
    const index = priceFilters.indexOf(price)

    if (~index) {
      priceFilters.splice(index, 1)

    } else {
      priceFilters.push(price)
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
        this.setState({isLoading: false}, () => this.props.onResults(res.body.businesses))
      })
      .catch(err => {
        console.error(err)
        this.setState({isLoading: false})
      })
  }
}

Search.PRICES = [1, 2, 3, 4]
const Price = ({id, selected, onClick}) => (
  <button value={id} onClick={onClick} className={cx('button', {'is-primary': selected})}>
    {repeat('$', id)}
  </button>
)
