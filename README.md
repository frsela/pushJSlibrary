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
   "ssl" : [ true | false ],

   ---> FOLLOWING attributes are only used in this fallback library <---

   "debug": [ true | false ],
   "keepalive": WEBSOCKET_KEEPALIVE_TIMER (in msecs),

   ---> FOLLOWING attributes are only used for testing purpose in order
        to simulate UDP/TCP wakeup service in the client machine.
        use only if you know what are you doing <---
   "wakeup_enabled": [ true | false ],
   "wakeup_host": "WAKEUP_HOSTNAME",
   "wakeup_port: WAKEUP_PORT,
   "wakeup_protocol: [ 'tcp' | 'udp' ],
   "wakeup_mcc: 'MOBILE COUNTRY CODE',
   "wakeup_mnc: 'MOBILE NETWORK CODE'
});
```

Each JSON attribute is optional, so you can configure one, two or all in a
single request.

Call setup before any other use

To reset to factory defaults:

```javascripot
navigator.push.defaultconfig();
```

## CDN

The last release of the JS library is available in: <a href="http://frsela.github.com/pushJSlibrary/">http://frsela.github.com/pushJSlibrary/</a>
