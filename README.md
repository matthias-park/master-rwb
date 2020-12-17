# nodejs next web

#### Installation:

`npm install`

#### Config file :

```json
{
  "franchises": [
    {
      "name": "bundle name",
      "domain": "request domain associated bundle",
      "theme": "styles bundle name - styles/[name].main.scss",
      "api": "rails api url"
    }
  ],
  "port": "port to start dev/prod"
}
```

#### To start dev :

`npm start`

starts webpack dev server with api proxy from config/default.json

#### Hosts file :

`127.0.0.1 bnl.local`

#### To visit app :

`bnl.local:3800`

#### Build stage/prod :

`NODE_ENV=stage npm start build`
`NODE_ENV=stage node web.js`
