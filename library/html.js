    function $(id) {
      return document.getElementById(id);
    };

    function register(_IN) {
    var c = navigator.pushNotification.requestRemotePermission(_IN);
  	c.onsuccess=function(url) {
    		$('endpointURL').innerHTML = url;
  	};
  	c.onmessage=function(msg) {
    		$('asyncmsg').innerHTML = JSON.stringify(msg);
  	};
    };


    function generateMQJSON() {
      t = $('queuedata');
      json = {
        "uaid": navigator.pushNotification.token,
        "messageId": "abcd",
        "payload": {
          "appToken": navigator.pushNotification.publicURLs[0],
          "channelID":"1234",
          "version": 1
        }
      };
      t.innerHTML = JSON.stringify(json);
    };

    function getSetup() {
      c = navigator.pushNotification.getSetup();
      $('setup_debug').checked = (c.debug === "true" || c.debug ? true : false);
      $('setup_host').value = c.host;
      $('setup_port').value = c.port;
      $('setup_ssl').checked = (c.ssl === "true" || c.ssl ? true : false);
      $('setup_ka').value = c.keepalive;
      $('setup_wu_enabled').checked = (c.wakeup_enabled === "true" ? true : false);
      $('setup_wu_host').value = c.wakeup_host;
      $('setup_wu_port').value = c.wakeup_port;
      $('setup_wu_proto').value = c.wakeup_protocol;
      $('setup_wu_mcc').value = c.wakeup_mcc;
      $('setup_wu_mnc').value = c.wakeup_mnc;
    };

    function changeSetup(param, value) {
      navigator.pushNotification.setup(JSON.parse('{"'+param+'": "'+value+'"}'));
      getSetup();
    };

    function updateVersion() {
      var oReq = new XMLHttpRequest();
      oReq.onload = function() {
        console.log(this.responseText);
      };
      oReq.open('put', $('endpointURL').innerHTML, true);
      oReq.send('version='+$('channelVersion').value);
    };

    function updateVersion_noVersion() {
      var oReq = new XMLHttpRequest();
      oReq.onload = function() {
        console.log(this.responseText);
      };
      oReq.open('put', $('endpointURL').innerHTML, true);
      oReq.send('version=');
    };

    function updateVersion_wrongEndPoint() {
      var oReq = new XMLHttpRequest();
      oReq.onload = function() {
        console.log(this.responseText);
      };
      oReq.open('put', 'https://owd-push-qa-fe1:8081/v1/notify/6529a94b1ffd75da4d5b6a7eff85e13b5905903dbe7d69ee60e135df09b1ce27', true);
      oReq.send('version='+$('channelVersion').value);
    };

    function updateVersion_incorrectVersion() {
      var oReq = new XMLHttpRequest();
      oReq.onload = function() {
        console.log(this.responseText);
      };
      oReq.open('put', $('endpointURL').innerHTML, true);
      oReq.send('version=HELLO');
    };

    window.onload = getSetup;

