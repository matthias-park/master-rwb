# nodejs next web

#### Installation:

`npm install`

#### Config file :

```json
{
  "franchises": [
    {
      "name": "bundle name",
      "domains": [
        {
          "hostname": "request domain associated bundle",
          "api": "rails api url"
        }
      ],
      "kambi": "kambi bootstrap & api urls",
      "theme": "styles bundle name - styles/[name]",
      "googleRecaptchaKey": "google recaptcha v3 site-key",
      "basicAuthEnabled": "enable basic auth for franchise"
    }
  ],
  "port": "port to start dev/prod",
  "basicAuth": {
    "whitelistedIp": "array of ip's",
    "users": [
      {
        "username": "",
        "password": ""
      }
    ]
  }
}
```

#### To start dev :

`npm start`

starts webpack dev server with api proxy from config/default.json

#### Hosts file :

`127.0.0.1 bnl.local`
`127.0.0.1 safecasino.local`

#### To visit app :

`bnl.local:3800` - Scooore
`safecasino.local:3800` - SafeCasino

#### Build stage :

`NODE_ENV=stage npm start build`
`NODE_ENV=stage node build/server/index.js`
