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

To change the default configuration use the setup method:

```javascript
navigator.push.setup({
  "host": "PUSH_SERVER_HOSTNAME",
  "port": PUSH_SERVER_PORT,
  "ssl" : [ true | false ]

   ---> FOLLOWING attributes are only used in this fallback library <---

   "debug": [ true | false ],
   "keepalive": WEBSOCKET_KEEPALIVE_TIMER (in msecs)
});
```

Each JSON attribute is optional, so you can configure one, two or all in a
single request.

## CDN

The last release of the JS library is available in: <a href="http://frsela.github.com/pushJSlibrary/">http://frsela.github.com/pushJSlibrary/</a>
