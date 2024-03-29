import React from 'react'

export default class Options extends React.PureComponent {
  render() {
    if (!this.props.options) return null

    return (
      <section className="section">
        {this.props.options.map(business =>
          <div className="media" key={business.id}>
            <figure className="media-left">
              <p className="image is-96x96">
                <img src={business.image_url} />
              </p>
            </figure>
            <div className="media-content">
              <div className="content">
                <p className="title is-4" style={{marginBottom: '1.2em'}}>
                  <a href={business.url} target="_blank">{business.name}</a>
                </p>
                <p className="subtitle">
                  <span className="tags has-addons">
                    <span className="tag is-warning is-marginless">
                      <span>{business.rating}</span>
                      <span className="icon">
                        <i className="fa fa-star" />
                      </span>
                    </span>
                    <span className="tag is-success is-marginless">{business.price}</span>
                  </span>
                </p>
                <p className="is-marginless">
                  {business.categories.map((category, i, cs) =>
                    <span key={category.alias}>{category.title}{(i != cs.length-1) && ', '}</span>
                  )}
                </p>
                <p className="is-marginless">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${business.name},${encodeURIComponent(business.location.display_address.join(','))}`} target="_blank">
                    {precisionRound(toMiles(business.distance), 1)} miles away
                  </a>
                </p>
                <p className="is-marginless">
                  <a href={'tel:' + business.phone}>{business.display_phone}</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {!this.props.options.length?
          <p>No Results</p>
        :null}
      </section>
    )
  }
}

function toMiles(meters) {
  return meters * 0.000621371192
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}
