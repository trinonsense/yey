import React from 'react'
import request from 'superagent'
import cx from 'classnames'
import repeat from 'lodash.repeat'
import styled from 'styled-components'

export default class Search extends React.PureComponent {
  render() {
    const {isLoading} = this.state
    const {fullWidth} = this.props

    return (
      <section className="section">
        <form onSubmit={this.onSubmit}>
          <Fields fullWidth={fullWidth}>
            <div className="field">
              <label className="label">Category</label>
              <div className="control">
                <div className="buttons has-addons">
                  {Search.CATEGORIES.map(category =>
                    <Category
                      key={category.value}
                      category={category}
                      onClick={this.updateCategory}
                      selected={this.state.category === category}
                      small={this.props.options}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Distance</label>
              <div className="control">
                <div className="buttons has-addons">
                  {Search.DISTANCES.map(distance =>
                    <Distance
                      key={distance.value}
                      distance={distance}
                      onClick={this.updateDistance}
                      selected={this.state.distance === distance}
                      small={this.props.options}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Prices</label>
              <div className="control">
                <div className="buttons has-addons">
                  {Search.PRICES.map(id =>
                    <Price
                      key={id}
                      id={id}
                      onClick={this.filterPrice}
                      selected={~this.state.priceFilters.indexOf(id)}
                      small={this.props.options}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="field">
              <YeyButton className={cx('button is-link is-medium yey-button', {'is-loading':isLoading})} disabled={isLoading}>
                <span>Yey</span>
                <span className="icon">
                  <i className="fa fa-random" />
                </span>
              </YeyButton>
            </div>
          </Fields>
        </form>
      </section>
    )
  }

  constructor() {
    super()

    this.state = {
      isLocated: false,
      isLoading: false,
      category: null,
      distance: null,
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
    // this.search()
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
    this.setState({
      category: category === this.state.category ? null : category
    })
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
        term: this.state.category && this.state.category.value,
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
  {display_name: '~1 mi', icon: 'street-view', value: 1609},
  {display_name: '~2 mi', icon: 'bicycle', value: 3218},
  {display_name: '~5 mi', icon: 'car', value: 8046}
]
Search.CATEGORIES = [
  {display_name: 'Restaurants', icon: 'utensils', value: 'restaurants'},
  {display_name: 'Bars', icon: 'glass-martini', value: 'bars'},
  {display_name: 'Coffee', icon: 'coffee', value: 'coffee'}
]

const Category = ({category, onClick, selected, small}) => (
  <button onClick={e => onClick(e, category)} className={cx('button', {'is-warning': selected, 'is-small': small})}>
    <span className="icon">
      <i className={'fas fa-' + category.icon} />
    </span>
    <span>{category.display_name}</span>
  </button>
)

const Price = ({id, selected, onClick, small}) => (
  <button value={id} onClick={onClick} className={cx('button', {'is-warning': selected, 'is-small': small})}>
    {repeat('$', id)}
  </button>
)

const Distance = ({distance, selected, onClick, small}) => (
  <button onClick={e => onClick(e, distance)} className={cx('button', {'is-warning': selected, 'is-small': small})}>
    <span className="icon">
      <i className={'fas fa-' + distance.icon} />
    </span>
    <span>{distance.display_name}</span>
  </button>
)

const YeyButton = styled.button`
  width: 100%;
  margin-top: 15px;
  text-transform: uppercase;
  font-weight: bold;
`

const Fields = styled.div`
  @media (min-width: 940px) {
    ${(props => props.fullWidth && `
      display: flex;

      .field:not(:last-child) {
        margin-bottom: 0;
        margin-right: .75rem;
      }

      .label {
        display: none;
      }

      .button {
        margin: 0;
      }

      .yey-button {
        font-size: 1rem;
      }
    `)}
  }
`
