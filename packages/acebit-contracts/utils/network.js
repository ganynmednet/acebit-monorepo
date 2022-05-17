// import 'dotenv/config';
require('dotenv').config();

module.exports = {
    apiKey: function(networkName) {
        if (networkName) {
          const api = process.env['API_KEY_' + networkName.toUpperCase()];
          if (api && api !== '') {
            return api;
          }
          if (!api || api === '') {
            console.error("Invalid API KEY config: %s", networkName);
            throw new Error("Invalid ENV param");
          }
        }
    },
    node_uri: function(networkName) {
        if (networkName) {
          const api = process.env['NODE_URI_' + networkName.toUpperCase()];
          if (api && api !== '') {
            return api;
          }
          if (!api || api === '') {
            console.error("Invalid NODE URI config: %s", networkName);
            throw new Error("Invalid ENV param");
          }
        }
    }
}