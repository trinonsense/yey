const request = require('superagent')
const YELP_API_KEY = 'kMKVrKa8G-0djNR8oRCZVTR_uAI95x4Bc0wWzUpghzG7Ci8AepRQYbtrphyA7XWu6mEumLti19OsOwjaNpciN4d7iwaY0TuX6GPeb-sV9zN0AFewkgxFWYhwgmqVWnYx'

exports.search = (req, res) => {
  res.header('Content-Type','application/json')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'GET') {
    request
      .get('https://api.yelp.com/v3/businesses/search')
      .set({'Authorization': 'Bearer ' + YELP_API_KEY})
      .query(req.query)
      .then(({body}) => res.json(body))
      .catch(({response}) =>
        res.status(response.status).send(response.text)
      )

  } else {
    res.sendStatus(404)
  }
}
