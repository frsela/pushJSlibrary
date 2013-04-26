/**
 * This library implements the navigator.mozPush & navigator.push libraries
 * on a non natively supported browsers.
 * This can be used as a secure fallback since the native version is used if it
 * exists
 * 
 * Author: Fernando Rodríguez Sela, 2013
 * All rights reserverd. January 2013
 * 
 * License: GNU Affero V3 (see LICENSE file)
 */


'use strict';

/**
 * Implementation of navigator.push
 * W3C spec: http://www.w3.org/TR/push-api/
 */

function _Push() {
}
_Push.prototype = {
  /////////////////////////////////////////////////////////////////////////
  // Push methods
  /////////////////////////////////////////////////////////////////////////

  setGlobals: function(_IN){
    _IN = typeof _IN !== 'undefined' ? _IN : {whatever:true};
    this._uaid     = typeof _IN.uaid     !== 'undefined' ? _IN.uaid     : this.token;
    this._channels = typeof _IN.channels !== 'undefined' ? _IN.channels : [];
    this._ip       = typeof _IN.ip       !== 'undefined' ? _IN.ip       : this.wakeup.host;
    this._port     = typeof _IN.port     !== 'undefined' ? _IN.port     : this.wakeup.port;
    this._mcc      = typeof _IN.mcc      !== 'undefined' ? _IN.mcc      : this.wakeup.mcc;
    this._mnc      = typeof _IN.mnc      !== 'undefined' ? _IN.mnc      : this.wakeup.mnc;
    this._protocol = typeof _IN.protocol !== 'undefined' ? _IN.protocol : this.wakeup.protocol;
	
	this._IN = _IN;
  },

  requestURL: function(watoken, certUrl) {
    this.debug('[requestURL] Warning, DEPRECATED method. Use requestRemotePermission instead');
    return this.requestRemotePermission(watoken, certUrl);
  },

  requestHello: function(_IN) {
    this.hello(_IN); 
  },

  requestRemotePermissionEx: function(watoken, certUrl) {
    var cb = {};

    if(!watoken || !certUrl) {
      this.debug('[requestRemotePermission] Error, no WAToken nor certificate URL provided');
      setTimeout(function() {
        if(cb.onerror) cb.onerror('Error, no WAToken nor certificate URL provided');
      });
      return cb;
    }

    this.registerUA(function () {
      this.registerWA(watoken, certUrl, function(URL) {
        this.debug('[registerWA Callback] URL: ',URL);
        if(cb.onsuccess) {
          cb.onsuccess(URL);
        }
      }.bind(this));
    }.bind(this));

    var self=this;
    window.addEventListener('pushmessage', function(event) {
      self.debug('[pushmessage Callback] Message: ',event);
      if(cb.onmessage) {
        cb.onmessage(JSON.parse(event.detail.message));
      }
    });

    return cb;
  },

  requestRemotePermission: function(_IN) {
    var cb = {};

    this.setGlobals(_IN);

    this.registerUA(function () {
      this.registerWA(function(URL) {
        this.debug('[registerWA Callback] URL: ',URL);
        if(cb.onsuccess) {
          cb.onsuccess(URL);
        }
      }.bind(this));
    }.bind(this));

    var self=this;
    window.addEventListener('pushmessage', function(event) {
      self.debug('[pushmessage Callback] Message: ',event);
      if(cb.onmessage) {
        cb.onmessage(JSON.parse(event.detail.message));
      }
    });

    return cb;
  },

  revokeRemotePermission: function(_IN) {

    this.setGlobals(_IN);

    this.unregisterWA(_IN);
  },

  /**
   * Setup PUSH interface
   * data is a JSON object with these attributes:
   * {
   *  "host": "PUSH_SERVER_HOSTNAME",
   *  "port": PUSH_SERVER_PORT,
   *  "ssl": [ true | false ],
   *
   *   ---> FOLLOWING attributes are only used in this fallback library <---
   *  "debug": [ true | false ],
   *  "keepalive": WEBSOCKET_KEEPALIVE_TIMER (in msecs),
   *
   *   ---> FOLLOWING attributes are only used for testing purpose in order
   *        to simulate UDP/TCP wakeup service in the client machine.
   *        use only if you know what are you doing <---
   *  "wakeup_enabled": [ true | false ],
   *  "wakeup_host": "WAKEUP_HOSTNAME",
   *  "wakeup_port: WAKEUP_PORT,
   *  "wakeup_protocol: [ 'tcp' | 'udp' ],
   *  "wakeup_mcc: 'MOBILE COUNTRY CODE',
   *  "wakeup_mnc: 'MOBILE NETWORK CODE'
   * }
   */
  setup: function(data) {
    if(!data)
      return;

    // Setupable parameters:
    //  id: [ 'DESCRIPTION', 'attribute to store in', Shall be reinit? ]
    var _params = {
      host: ['hostname', 'this.server.host', true],
      port: ['port', 'this.server.port', true],
      ssl: ['ssl', 'this.server.ssl', true],

      // Out of the W3C standard
      debug: ['DEBUG', 'this.DEBUG', false],
      keepalive: ['keepalive', 'this.server.keepalive', true],

      // WakeUp development parameters
      wakeup_enabled: ['WakeUp ENABLED', 'this.wakeup.enabled', true],
      wakeup_host: ['WakeUp host', 'this.wakeup.host', true],
      wakeup_port: ['WakeUp port', 'this.wakeup.port', true],
      wakeup_protocol: ['WakeUp protocol', 'this.wakeup.protocol', true],
      wakeup_mcc: ['WakeUp MCC', 'this.wakeup.mcc', true],
      wakeup_mnc: ['WakeUp MNC', 'this.wakeup.mnc', true],

      //ACK message type
      ack: ['ack','this.ack', true],
      ack_null_updates: ['ack_null_updates', 'this.ack_null_updates', true],
      ack_invalid_channelID: ['ack_invalid_channelID','this.ack_invalid_channelID', true],
      ack_null_channelID: ['ack_null_channelID','this.ack_null_channelID', true],
      ack_null_version: ['ack_null_version','this.ack_null_version', true],
      ack_invalid_version: ['ack_invalid_version','this.ack_invalid_version', true],

      //PING PONG
      ping: ['ping','this.ping', true],
      pong: ['pong','this.pong', true],
      other: ['other','this.other', true]
    };
    var _setup = function(param, value) {
      if(param === undefined) {
        this.debug('[setup::_setup] No recognized param value');
        return;
      }
      if (value === undefined) {
        return;
      }

      this.debug('[setup::_setup] Changing ' + param[0] + ' to: ' + value);
      if(typeof(value) == 'string') {
        eval(param[1] += ' = "' + value + '"');
      } else {
        eval(param[1] += ' = ' + value);
      }
      if (param[2])
        this.initialized = false;
    }.bind(this);

    this.debug('[setup] Setup data received: ', data);
    _setup(_params.host, data.host);
    _setup(_params.port, data.port);
    _setup(_params.ssl, data.ssl);

    // Out of the W3C standard
    _setup(_params.debug, data.debug);
    _setup(_params.keepalive, data.keepalive);

    // WakeUp development parameters
    _setup(_params.wakeup_enabled, data.wakeup_enabled);
    _setup(_params.wakeup_host, data.wakeup_host);
    _setup(_params.wakeup_port, data.wakeup_port);
    _setup(_params.wakeup_protocol, data.wakeup_protocol);
    _setup(_params.wakeup_mcc, data.wakeup_mcc);
    _setup(_params.wakeup_mnc, data.wakeup_mnc);

    // ACK parameters
    _setup(_params.ack, data.ack);
    _setup(_params.ack_null_updates, data.ack_null_updates); 
    _setup(_params.ack_invalid_channelID, data.ack_invalid_channelID);
    _setup(_params.ack_null_channelID, data.ack_null_channelID);
    _setup(_params.ack_null_version, data.ack_null_version);
    _setup(_params.ack_invalid_version, data.ack_invalid_version);

    // Ping pong params
    _setup(_params.ping, data.ping);
    _setup(_params.pong, data.pong);
    _setup(_params.other, data.other);

    //_setup(_params.)

    if (!this.initialized) {
      this.debug('[setup] Reinitializing . . .');
      this.init();
    }
    this.debug('[setup] Current status SERVER: ', this.server);
    this.debug('[setup] Current status WAKEUP: ', this.wakeup);
    this.debug('[setup] Current status DEBUG: ', (this.DEBUG ? 'ON' : 'OFF'));
  },

  /**
   * Current setup recovery
   */
  getSetup: function() {
    return {
      debug: this.DEBUG,
      host: this.server.host,
      port: this.server.port,
      ssl: this.server.ssl,
      keepalive: this.server.keepalive,
      wakeup_enabled: this.wakeup.enabled,
      wakeup_host: this.wakeup.host,
      wakeup_port: this.wakeup.port,
      wakeup_protocol: this.wakeup.protocol,
      wakeup_mcc: this.wakeup.mcc,
      wakeup_mnc: this.wakeup.mnc,
      ack: this.ack,
      ack_null_updates: this.ack_null_updates,
      ack_invalid_channelID: this.ack_invalid_channelID,
      ack_null_channelID: this.ack_null_channelID,
      ack_null_version: this.ack_null_version,
      ack_invalid_version: this.ack_invalid_version,
      ping: this.ping,
      pong: this.pong,
      other: this.other
    };
  },

  /////////////////////////////////////////////////////////////////////////
  // Auxiliar methods (out of the standard, only used on this fallback)
  /////////////////////////////////////////////////////////////////////////

  /**
   * Set to defaults
   */
  defaultconfig: function() {
    this.server = {};
    this.wakeup = {};
    this.setup({
      debug: true,
      host: 'owd-push-qa-fe1',
      port: 8080,
      ssl: true,
      keepalive: 60000,
      wakeup_enabled: false,
      wakeup_host: 'owd-push-qa-fe1',
      wakeup_port: 8080,
      wakeup_protocol: 'udp',
      wakeup_mcc: '214',
      wakeup_mnc: '07',
      ack: true,
      ack_null_updates: false,
      ack_invalid_channelID: false,
      ack_null_channelID: false,
      ack_null_version: false,
      ack_invalid_version: false,
      ping: true,
      pong: false,
      other: false
    })
  },

  /**
   * Initialize
   */
  init: function() {
    if(this.initialized) {
      return;
    }

    this.debug('Initializing',this.server);

    this.server.ad_ws = 'ws'+(this.server.ssl == "true" || this.server.ssl ? 's' : '')+'://';
    this.server.ad_ws += this.server.host + ':' + this.server.port;

    this.server.ws = {
      connection: null,
      ready: false
    };

    this.server.registeredUA = false;

    this.token = null;
    //this.token = 'dd9cbbe1-b255-48d5-8c6a-21702664ec33@98885403e99df8411e063fc8dbc88eac7efed54b';
    this.publicURLs = [];

    this.initialized = true;
  },

  /**
   * Hello
   */
  hello: function(_IN) {

    this.setGlobals(_IN);

    if (this.wakeup.enabled) {
      this.sendWS({
        uaid: this._uaid,
        channelIDs: this._channels,
        'interface': {
          ip: this._ip,
          port: this._port
        },
        mobilenetwork: {
          mcc: this._mcc,
          mnc: this._mnc
        },
        protocol: this._protocol,
        messageType: 'hello'
      });
    } else {
      this.sendWS({
        uaid: this._uaid,
        channelIDs: this._channels,
        messageType: 'hello'
      });
    }
  },

  /**
   * Register UA
   */
  registerUA: function(cb) {
    if(this.server.registeredUA) {
      if(cb) cb();
      return;
    }

    this.onRegisterUAMessage = function(msg) {
      this.token = msg.uaid;
      if(cb) cb();
    }.bind(this);

    this.openWebsocket();
  },

  /**
   * Register WA
   */
  registerWA: function(cb) {
    this.onRegisterWAMessage = function(msg) {
      this.debug('[onRegisterWAMessage] ', msg);

      this.publicURLs.push(msg.pushEndpoint);

      if(cb) cb(msg.pushEndpoint);
    }.bind(this);

    this.debug('[registerWA] Going to register WA');
    this.sendWS({
      channelID: this._channels,
      messageType: 'register'
    });
  },

  /**
   * Unregister WA
   */
  unregisterWA: function(_IN) {

    _IN = typeof _IN !== 'undefined' ? _IN : {whatever:true};
    this._channels = typeof _IN.channels !== 'undefined' ? _IN.channels : [];

    this.debug('[unregisterWA] Going to unregister WA');
    this.sendWS({
      channelID: this._channels,
      messageType: 'unregister'
    });
  },

  /**
   * Open Websocket connection
   */
  openWebsocket: function() {
    if (this.server.ws.ready)
      return;

    this.debug('[openWebsocket] Openning websocket to: ' + this.server.ad_ws);
    this.server.ws.connection =
      new WebSocket(this.server.ad_ws, 'push-notification');

    this.server.ws.connection.onopen = this.onOpenWebsocket.bind(this);
    this.server.ws.connection.onclose = this.onCloseWebsocket.bind(this);
    this.server.ws.connection.onerror = this.onErrorWebsocket.bind(this);
    this.server.ws.connection.onmessage = this.onMessageWebsocket.bind(this);
  },

  /**
   * Send a Websocket message (object)
   */
  sendWS: function(json) {
    var msg = JSON.stringify(json);
    this.debug('[sendWS] Preparing to send: ' + msg);
    this.server.ws.connection.send(msg);
  },

  /**
   * Websocket callbacks
   */

  onOpenWebsocket: function() {
    this.debug('[onOpenWebsocket] Opened connection to ' + this.server.host);
    this.server.ws.ready = true;

    // We shall registerUA each new connection
    this.debug('[onOpenWebsocket] Started registration to the notification server');
    this.hello(this._IN);

    if(this.server.keepalive > 0) {
      this.keepalivetimer = setInterval(function() {
        if (this.pong){
		this.debug('[Websocket Keepalive] Sending keepalive message. PONG');
        	this.server.ws.connection.send('PONG');
	} else if (this.other) {
		this.debug('[Websocket Keepalive] Sending keepalive message. OTHER');
		this.server.ws.connection.send('OTHER');
	} else if (this.ping) {
		this.debug('[Websocket Keepalive] Sending keepalive message. PING');
		this.server.ws.connection.send('PING');
	}
      }.bind(this), this.server.keepalive);
    }
  },

  onCloseWebsocket: function(e) {
    this.debug('[onCloseWebsocket] Closed connection to ' + this.server.ad +
      ' with code ' + e.code + ' and reason ' + e.reason);
    this.server.ws.ready = false;
    this.server.registeredUA = false;
    clearInterval(this.keepalivetimer);
  },

  onErrorWebsocket: function(e) {
    this.debug('[onErrorWebsocket] Error in websocket in ' + this.server.ad +
      ' with error ' + e.error);
    this.server.ws.ready = false;
  },

  onMessageWebsocket: function(e) {
    this.debug('[onMessageWebsocket] Message received --- ' + e.data);
    if (e.data === 'PONG') {
      return;
    }
    var msg = JSON.parse(e.data);
    if(msg[0]) {
      for(var m in msg) {
        this.manageWebSocketResponse(msg[m]);
      }
    } else {
      this.manageWebSocketResponse(msg);
    }
  },

  manageWebSocketResponse: function(msg) {
    switch(msg.messageType) {
      case 'hello':
        this.server.registeredUA = true;
        this.onRegisterUAMessage(msg);
        break;

      case 'register':
        this.debug('[manageWebSocketResponse register] Registered channelID');
        this.onRegisterWAMessage(msg);
        break;

      case 'notification':
      case 'desktopNotification':
        this.debug('[manageWebSocketResponse notification] Going to ack the message ', msg);
        var event = new CustomEvent('pushmessage', {
          "detail": { "message": JSON.stringify(msg.updates) }
        });
        window.dispatchEvent(event);
	
	if (this.ack_null_updates)	
	{
		this.debug('[sendWS]{messageType: "ack",messageId: {messageType: "notification", updates: null, status: "OK"}}');
        	this.sendWS({
          		messageType: 'ack',
          		messageId: {messageType: "notification", updates: null, status: "OK"}
        	});
        	break;
	} else if (this.ack_invalid_channelID)
	{
		this.debug('[sendWS]{messageType: "ack",messageId: {messageType: "notification", updates: { channelID: "", version: 1},status: "OK"}}');
        	this.sendWS({
          		messageType: 'ack',
          		messageId: {messageType: "notification", updates: { channelID: "", version: 1}, status: "OK"}
        	});
        	break;
	} else if (this.ack_null_channelID)
	{
		this.debug('[sendWS]{messageType: "ack",messageId: {messageType: "notification", updates: { channelID: null, version: 1},status: "OK"}}');
        	this.sendWS({
          		messageType: 'ack',
          		messageId: {messageType: "notification", updates: { channelID: null, version: 1}, status: "OK"}
        	});
        	break;
	} else if (this.ack_null_version)
	{
		this.debug('[sendWS]{messageType: "ack",messageId: {messageType: "notification", updates: { channelID: "1234", version: null},status: "OK"}}');
        	this.sendWS({
          		messageType: 'ack',
          		messageId: {messageType: "notification", updates: { channelID: "1234", version: null}, status: "OK"}
        	});
        	break;
	} else if (this.ack_invalid_version)
	{
		this.debug('[sendWS]{messageType: "ack",messageId: {messageType: "notification", updates: { channelID: "1234", version: ""},status: "OK"}}');
        	this.sendWS({
          		messageType: 'ack',
          		messageId: {messageType: "notification", updates: { channelID: "1234", version: ""}, status: "OK"}
        	});
        	break;
	} 

	this.debug('[sendWS]{messageType: "ack",messageId:', msg);
      	this.sendWS({

       		messageType: 'ack',
       		messageId: msg
      	});
       	break;
    }
  },

  /**
   * Debug logger method
   */
  debug: function(msg, obj) {
    if(this.DEBUG) {
      var message = msg;
      if(obj) {
        message += ': ' + JSON.stringify(obj);
      }
      console.log('[PUSH (LIBRARY) LIBRARY DEBUG] ' + message);
    }
  }
};

/**
 * Autoinitialization and redefinition of navigator.push if needed
 */

(function() {
  // Enable/Disable DEBUG traces
  var DEBUG = true;

  /**
   * Debug logger method
   */
  function debug(msg, obj) {
    if(DEBUG) {
      var message = msg;
      if(obj) {
        message += ': ' + JSON.stringify(obj);
      }
      console.log('[PUSH (INIT) LIBRARY DEBUG] ' + message)
    }
  }

  /**
   * Check navigator.[mozPushNotification|pushNotification] support and fallback if not supported
   */
  function init() {
    debug('Checking navigator.push existance');
    if(navigator.pushNotification) {
      debug('navigator.pushNotification supported by your browser');
      return;
    }
    if(navigator.mozPushNotification) {
      debug('navigator.mozPushNotification supported by your browser');
      navigator.pushNotification = navigator.mozPushNotification;
      debug('navigator.pushNotification = navigator.mozPushNotification');
      return;
    }
    debug('No pushNotification supported by your browser. Falling back');
    navigator.pushNotification = new _Push();
    navigator.mozPushNotification = navigator.pushNotification;
    navigator.pushNotification.defaultconfig();
    navigator.pushNotification.init();
  }

  init();
})();
