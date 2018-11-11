# Cheesebox

We are migrating to a new API.

For the HTTP only adapters, checkout 86504a81abb459d90d9dc2d126680b6df9d280a5

Cheesebox is a minimalistic UI to build custom exchanges. It's build with React and Redux.

The focus is easy portability and fast setup. This means the Redux side is kept simple, so its easy to extend for your own use cases.


All API calls are abstracted by a client library taking care of the connection. This means Cheesebox accepts a client which does the data conversions and maps the corresponding endpoints.

So far this repository contains examples for eos/eosfinex (`dev-eosfinex.js`) and hive (`dev-hive.js`).

If you created an own exchange / connector, feel free to submit a [Pull Request](https://github.com/bitfinexcom/cheesebox/pulls).


```
# eosfinex
npm run start-eosfinex

# hive

npm run start-hive
```


## Adding your own exchange

1. Implement your own client, see `src/adapters` for examples. Extend the exisiting methods of the base Mandelbrot class.
2. Modify `src/app-hive.jsx` to load your own client and user config
3. Profit!

For an example whats needed to add your own exchange, see https://github.com/bitfinexcom/cheesebox/commit/37dbc02350efea867b272f10b183828e8672daf9
