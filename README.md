# Cheesebox

Cheesebox is a minimalistic UI to build own exchanges. It's build with React and Redux. The Redux side is kept simple, so its easy to extend for your own use cases.

All API calls are abstracted by a client library taking care of the connection. This means Cheesebox accepts a client which does the data conversions and maps the corresponding endpoints.

So far this repository contains examples for eos/eosfinex (`index-eos.js`) and hive (index-hive.js).

If you created an own exchange / connector, feel free to submit a [Pull Request]().


```
# eosfinex

nodemon -e js,jsx dev-eosfinex.js -w src

# hive

nodemon -e js,jsx dev-hive.js -w src
```


## Adding your own exchange

1. Implement your own client, see `src/adapters` for examples. Extend the exisiting methods of the base Mandelbrot class.
2. Modify `src/app-hive.jsx` to load your own client and user config
3. Profit!
