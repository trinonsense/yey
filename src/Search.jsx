import React from 'react'
import request from 'superagent'

export default class Search extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      isLocated: false,
      isLoading: false,
      category: 'restaurants',
      priceFilters: [],
      coords: {
        latitude: 30.38673,
        longitude: -97.7104297
      }
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onLocate = this.onLocate.bind(this)
    this.search = this.search.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.filterPrice = this.filterPrice.bind(this)
  }

  render() {
    const {priceFilters} = this.state

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <select onChange={this.updateCategory} value={this.state.category}>
            <option value="restaurants">Restaurants</option>
            <option value="bars">Bars</option>
            <option value="coffee">Coffee Shops</option>
          </select>
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
          <button type="submit">Search</button>
        </form>
      </div>
    )
  }

  onSubmit(e) {
    e.preventDefault()

    if (this.state.isLocated) {
      this.search()

    } else {
      if (window.navigator.geolocation) {
        console.log('locating...')
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

  search() {
    this.setState({isLoading: true})
    console.log('loading...')
    request
      .get('https://us-central1-yey-y3y.cloudfunctions.net/search')
      .query({
        term: this.state.category,
        latitude: this.state.coords.latitude,
        longitude: this.state.coords.longitude,
        price: this.state.priceFilters.join(',')
      })
      .then(res => console.log(res.body))
      .catch(err => console.error(err.response))
  }
}
