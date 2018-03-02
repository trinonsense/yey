import React from 'react'
import request from 'superagent'
import cx from 'classnames'
import repeat from 'lodash.repeat'

export default class Search extends React.PureComponent {
  render() {
    const {isLoading} = this.state

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div>
            <h3>Category</h3>
            <div className="buttons has-addons">
              {Search.CATEGORIES.map(category =>
                <Category
                  key={category.value}
                  category={category}
                  onClick={this.updateCategory}
                  selected={this.state.category === category}
                />
              )}
            </div>
          </div>

          <div>
            <h3>Distance</h3>
            <div className="buttons has-addons">
              {Search.DISTANCES.map(distance =>
                <Distance
                  key={distance.value}
                  distance={distance}
                  onClick={this.updateDistance}
                  selected={this.state.distance === distance}
                />
              )}
            </div>
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

          <div>
            <button className={cx('button', {'is-loading':isLoading})} disabled={isLoading} type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    )
  }

  constructor() {
    super()

    this.state = {
      isLocated: false,
      isLoading: false,
      category: Search.CATEGORIES[0],
      distance: '',
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

  updateCategory(e, category) {
    e.preventDefault()
    this.setState({category})
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

  updateDistance(e, distance) {
    e.preventDefault()
    this.setState({
      distance: distance === this.state.distance? null : distance
    })
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
        radius: this.state.distance && this.state.distance.value,
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
Search.DISTANCES = [
  {display_name: 'Walking (1 mi.)', value: 1609},
  {display_name: 'Biking (2 mi.)', value: 3218},
  {display_name: 'Driving (5 mi.)', value: 8046}
]
Search.CATEGORIES = [
  {display_name: 'Restaurants', value: 'restaurants'},
  {display_name: 'Bars', value: 'bars'},
  {display_name: 'Coffee Shops', value: 'coffee'}
]

const Category = ({category, onClick, selected}) => (
  <button onClick={e => onClick(e, category)} className={cx('button', {'is-primary': selected})}>
    {category.display_name}
  </button>
)

const Price = ({id, selected, onClick}) => (
  <button value={id} onClick={onClick} className={cx('button', {'is-primary': selected})}>
    {repeat('$', id)}
  </button>
)

const Distance = ({distance, selected, onClick}) => (
  <button onClick={e => onClick(e, distance)} className={cx('button', {'is-primary': selected})}>
    {distance.display_name}
  </button>
)
