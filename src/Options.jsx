import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  options: PropTypes.array
}

export default class Options extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.options.map(business =>
          <div key={business.id}>
            <h2><a href={business.url}>{business.name}</a></h2>
            <img src={business.image_url} width="100" />
            <p>{business.rating}</p>
            <p>{business.price}</p>
            <p>{business.display_phone}</p>
            <ul>
              {business.categories.map(category =>
                <li key={category.alias}>{category.title}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

Options.propTypes = propTypes
Options.defaultProps = {
  options: []
}


