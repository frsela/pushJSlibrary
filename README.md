pushJSlibrary
=============

notification server PUSH client implemented in JS to be used as a fallback for
navigator.mozPush or navigator.push on all browsers

## Author:

- Fernando Rodríguez Sela (frsela @ tid . es)

## How to use

Import this JS library. From the app register the URL:

```javascript
navigator.push.requestURL(WAToken, PublicKey (in Base64));
```

To change the default configuration:

navigator.push.change:

```javascript
  DEBUG: true,    // Enable/Disable DEBUG traces
  server: {
    host: 'localhost:8080',
    ssl: true
  }
```

In future release, re-config methods will be provided.

## CDN

The last release of the JS library is available in: <a href="http://frsela.github.com/pushJSlibrary/">http://frsela.github.com/pushJSlibrary/</a>
