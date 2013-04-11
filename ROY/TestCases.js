//===========================================================================================
//
// THE TESTS.
//
describe("'Register' tests ...", function(){

	describe("Register()", function(){
		resetSettings();
		doRegister(); // First one is always a 'hello'.
		doRegister({channels:'1234'});
		checkMessage(true, ['[sendWS]', '"channelID":"1234"', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"status":200', '"channelID":"1234"', '"messageType":"register"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"status":200', '"channelID":"1234"', '"messageType":"register"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Register() null", function(){
		resetSettings();
		doRegister({channels:'1234'});
		doRegister({channels: null});	
		checkMessage(true, ['[sendWS]', '"channelID":null', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Register() invalid", function(){
		resetSettings();
		doRegister({channels:'1234'});
		doRegister({channels: ''});
		checkMessage(true, ['[sendWS]', '"channelID":""', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"',]);
		checkMessage(true, ['[onRegisterWAMessage]', '"messageType":"register"', '"status":457', '"reason":"Not valid channelID sent"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Register() several channels", function(){
		resetSettings();
		doRegister({channels:'1234'});
		doRegister({channels:'4321'});
		checkMessage(true, ['[sendWS]', '"channelID":"4321"', '"messageType":"register"']);
		checkMessage(true, ['[onMessageWebsocket]' , '"status":200', '"channelID":"4321"', '"messageType":"register"']);
		checkMessage(true, ['[onRegisterWAMessage]', '"status":200', '"channelID":"4321"', '"messageType":"register"']);
		doUnRegister(true, {channels:'1234'});
	});
	
});


describe("'Un-register' tests ...", function(){

	describe("Unregister()", function(){
		resetSettings();
		doRegister({channels:'1234'}); // First one is just 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, {channels:'1234'});
		checkMessage(true, ['[sendWS]', '"channelID":"1234"', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"channelID":"1234"', '"status":202', '"messageType":"unregister"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Unregister() null", function(){
		resetSettings();
		doRegister({channels:'1234'}); // First one is just 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, { channels: null });
		checkMessage(true, ['[sendWS]', '"channelID":null', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":457', '"reason":"Not valid channelID sent"', '"messageType":"unregister"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Unregister() invalid", function(){
		resetSettings();
		doRegister({channels:'1234'}); // First one is just 'hello'.
		doRegister({channels:'1234'});
		doUnRegister(false, { channels: '' });
		checkMessage(true, ['[sendWS]', 'Preparing to send', '"channelID":""', '"messageType":"unregister"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":457', '"reason":"Not valid channelID sent"', '"messageType":"unregister"']);
		doUnRegister(true, {channels:'1234'});
	});
	
});


describe("'Hello' tests ...", function(){

	describe("Hello()", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":_UAID', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() null uaid", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello({uaid:null});
		checkMessage(true, ['[sendWS]', '"uaid":_UAID', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() invalid uaid", function(){
		resetSettings();
		doRegister({channels:'1234'});
		doHello({uaid:''});
		checkMessage(true, ['[sendWS]', '"uaid":""', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() no channel ID", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello({channels:[]});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() one channel ID", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello({channels:['1234']});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":["1234"]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() several channel IDs", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello({channels:['1234','4321']});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":["1234","4321"]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() invalid IP, valid PORT", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello({ip:'256.256.256.256'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() valid IP, invalid PORT", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello({port:80000});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() valid IP, valid PORT", function(){
		resetSettings();
		doRegister({channels:'1234'}); 
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() invalid IP, invalid PORT", function(){
		doRegister({channels:'1234'}); 
		doHello({ip:'256.256.256.256',port:80000});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello() invalid mcc, valid mnc", function(){
		doRegister({channels:'1234'}); 
		doHello({mcc:'hola'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello()  valid mcc, invalid mnc", function(){
		doRegister({channels:'1234'}); 
		doHello({mnc:'hola'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello()  valid mcc, valid mnc", function(){
		doRegister({channels:'1234'}); 
		doHello();
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":201', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
	describe("Hello()  invalid mcc, invalid mnc", function(){
		doRegister({channels:'1234'}); 
		doHello({mcc:'hola',mnc:'hola'});
		checkMessage(true, ['[sendWS]', '"uaid":', '"channelIDs":[]', '"messageType":"hello"']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":200', '"uaid":_UAID', '"messageType":"hello"']);
		doUnRegister(true, {channels:'1234'});
	});
	
});


xdescribe("'Ping/Pong' tests (these pause for > 1 minute) ...", function(){

	describe("Set PING to true", function(){
		resetSettings();
		setTrue("ping");
		checkMessage(true, ['[Websocket Keepalive]', 'Sending keepalive message', 'PING']);
		checkMessage(true, ['[onMessageWebsocket]', 'Message received', 'PONG']);
		checkMessage(false, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
	describe("Set PONG to true", function(){
		resetSettings();
		setTrue("pong");
		checkMessage(true, ['[Websocket Keepalive]', 'Sending keepalive message', 'PONG']);
		checkMessage(true, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
});


xdescribe("'ACK' tests (these pause for > 1 minute) ...", function(){

	describe("Set 'ack' to true", function(){
		resetSettings();
		setTrue("ack");
		checkMessage(false, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
	describe("Set 'ack_null_updates' to true", function(){
		resetSettings();
		setTrue("ack_null_updates");
		checkMessage(true, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
	describe("Set 'ack_invalid_channelID' to true", function(){
		resetSettings();
		setTrue("ack_invalid_channelID");
		checkMessage(true, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
	describe("Set 'ack_null_channelID' to true", function(){
		resetSettings();
		setTrue("ack_null_channelID");
		checkMessage(true, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
	describe("Set 'ack_null_version' to true", function(){
		resetSettings();
		setTrue("ack_null_version");
		checkMessage(true, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
	describe("Set 'ack_invalid_version' to true", function(){
		resetSettings();
		setTrue("ack_invalid_version");
		checkMessage(true, ['[onMessageWebsocket]', '"status":"ERROR"']);
		doUnRegister(true);
	});
	
});
