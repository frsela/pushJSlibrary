//===========================================================================================
//
// COMMON FUNCTIONS.
//
var ConsoleLog	= new Array;
var _PAUSE		= 6000;
var _DEBUG 		= true;
var _UAID 		= false;

//
// Stores console.log output into the array, then reports it
// to the console as normal.
//
(function(){
    var oldLog = console.log;
    console.log = function (message) {
    	if (message.search('XXXXX') < 0){
//	        // Ignore messages that don't contain what we're after ...
//    		if ( ! _UAID) {
//		        if (message.search('"uaid":"') > 0){
//			        // Put the message string into an object (makes it easier to parse
//			        // the "uaid" from it this way).
//			        x = message.substring(message.indexOf("{"));
//			        obj = eval("(" + x + ')');
//			        
//			        // Set the _UAID variable.
//			        _UAID = obj.uaid;
//		        }
//    		}

	        ConsoleLog.push(message);
    	}
		oldLog.apply(console, arguments);
    };
})();

//
// Gets the UAD for this device into the global "_UAID" variable.
//
function getUAID(){
	var conslog	   = ConsoleLog;
	var cons_len   = conslog.length;
	
	// For each console log message ...
    for (var i=0; i<cons_len; i++){
        s = conslog[i];
        
        // Ignore messages that don't contain what we're after ...
        if (s.search('"uaid":"') < 0) continue;
        
        // Put the message string into an object (makes it easier to parse
        // the "uaid" from it this way).
        x = s.substring(s.indexOf("{"));
        obj = eval("(" + x + ')');
        
        // Set the _UAID variable.
        _UAID = obj.uaid;
        
        // Done - leave the 'for' loop.
        if (_UAID != false) break;
	}
}

//
// You can include global variables in a string ("_UAID" etc...)
// and this function will replace them with the real value.
//
function replaceWithGlobals(p_str){

	returnStr = p_str;
	
	returnStr = returnStr.replace("_UAID" , "");// _UAID ? '"' + _UAID + '"' : "null");
	returnStr = returnStr.replace("_PAUSE", _PAUSE);
	returnStr = returnStr.replace("_DEBUG", _DEBUG);
	
	return returnStr;
}

//
// Searches the collected console log messages for a string
// (returns "true" or "false").
//
// So we're not 'guessing' how long we need to wait before the console
// is updated, we'll use a timeout (seems to loop until it returns true ... not sure why!).
//
function checkLog(p_desc, p_str, p_bool){
	waitsFor(function(){
		//
		// Since UAID is dynamically generated, assume the first one we is 'it'.
		//
//		getUAID();
		
		result = false;
		if (_DEBUG) console.log("\n\n\nXXXXX checkLog: called, for: \"" + replaceWithGlobals(p_desc) + "\" ...");
		if (_DEBUG) console.log("XXXXX checkLog: calling runLogCheck() ...");
		result = runLogCheck(p_str);		
		return result;
	}, "console log to contain this array", 2000);
	runs(function(){
		if (p_bool){
			expect(result).toBeTruthy();
		}
		else{
			expect(result).toBeFalsy();
		}
		if (_DEBUG) console.log("\n\n");
	});
}
function runLogCheck(search_str){
	
	var conslog	   = ConsoleLog;
	var search_len = search_str.length;
	var cons_len   = conslog.length;
	
	if (_DEBUG) console.log("XXXXX runLogCheck: Console log array length: " + cons_len);
	if (_DEBUG) console.log("XXXXX runLogCheck: Searching for -" + replaceWithGlobals(search_str.toString()) + "-");
	
	// For each line in the console log array ...
    for (var i=0; i<cons_len; i++){
        s = conslog[i];
        
    	if (_DEBUG) console.log("XXXXX runLogCheck: ... in " + i + " -" + s + "-");
    	
        if (s.search("XXXXX") >= 0){continue;}
        
        //
        // Loop through each 'search_str' array element to make sure ALL of
        // them match this line.
        // Doing it like this means the elements can be in any order on the
        // line.
        //
        totalMatch = true;
        for (var i2=0; i2<search_len; i2++){
        	// Need to 'escape' any square brackets (they confuse the search!).
        	s2 = search_str[i2];
        	s2 = s2.replace("[", "\\[");
        	s2 = s2.replace("]", "\\]");
        	
        	// Populate any global variables (needs to be done in here because of
        	// asynchronous trickery ;o).
        	s2 = replaceWithGlobals(s2);
//        	if (_UAID) alert("s2: " + s2);
        	
	        if (s.search(s2) < 0){
	            totalMatch = false;
	            break; // Jump to next console line.
	        };
        }
        if (totalMatch){
        	if (_DEBUG) console.log("XXXXX runLogCheck: MATCH!");
        	// We found a match for everything on this line!
        	return true;
        };
    }
    
	//
	// If we get to here, we didn't find our line before the timeout.
	//
    return false;
}

//
//Function to do a quick and basic test that 'something' was communcated
//when register / hello / etc... is called.
//
function quickCommCheck(){
	checkLog("Quick check", ["[sendWS]"], true);
}

//
// Hello
//
function doHello(_IN){
	it ("(requesthello)", function(){
		runs(function(){
			//
			// Always clear the array first so we know that what's in it came AFTER our click.
			//
			ConsoleLog.length = 0;
			navigator.pushNotification.requestHello(_IN);
		});
		quickCommCheck();
	});
	
//	// These calls generate a new UAID, so catch it.
//	it("get the UAID for this device from the console log", function(){
//		runs(function(){
//			expect(_UAID).not.toBeFalsy();
//		});
//	});
}

//
// Register
//
function doRegister(_IN){
	it ("(register)", function(){
		runs(function(){
			if (_DEBUG) console.log("XXXXX registering...");
			//
			// Always clear the array first so we know that what's in it came AFTER our click.
			//
			ConsoleLog.length = 0;
			register(_IN);
		});
		quickCommCheck();
	});
}

//
// Un-register
//
function doUnRegister(p_skipCheck, _IN){
	it ("(un-register)", function(){
		runs(function(){
			// Always clear the array first so we know that what's in it came AFTER our click.
			if (! p_skipCheck) ConsoleLog.length = 0;
			navigator.pushNotification.revokeRemotePermission(_IN);
		});
		if (! p_skipCheck) quickCommCheck();
	});
}

//
// Check the console log for a specific message.
//
function checkMessage(p_true, p_regexp_array){
	boolCHK = (p_true) ? "" : "NOT ";
	boolCHK = boolCHK + " Reported to the console => ";
	
	if ( p_regexp_array[0] == "setup" ){
		it_msg = boolCHK + "Setup info for '" + p_regexp_array[1] + "' ...";
	}
	else {
		it_msg = boolCHK + "Message " + (p_regexp_array[0].search("sendWS")>=0 ? "TO" : "FROM") + " the server ";
		it_msg = it_msg + (p_true ? "contains" : "does not contain") + " "; 
		it_msg = it_msg + "(" + p_regexp_array.toString() + ")";
	}
		
	it(it_msg, function(){
		checkLog(it_msg, p_regexp_array, p_true);
    });
}

//
// Reset all setting to default.
//
// (I kept this out of 'setTrue()' in case we ever want to join a few settings together.)
//
function resetSettings(){
	it("reset settings", function(){
		runs(function(){
			ConsoleLog.length = 0;
			navigator.pushNotification.getSetup();
			navigator.pushNotification.defaultconfig();
		});
	});
	checkMessage(true, ['setup', 'Setup data received:']);
	checkMessage(true, ['setup', 'Reinitializing']);
}

//
// PING / PONG / OTHER / ACK / etc...
//
function _doSetupChange(p_type, p_boolTrueFalse){
	it ("(" + p_type + " = " + p_boolTrueFalse + ")", function(){
		runs(function(){
			ConsoleLog.length = 0;
			
			//
			// Now change what we want.
			//
			navigator.pushNotification.setup(JSON.parse('{"'+p_type+'": "'+p_boolTrueFalse+'"}'));
		});
	});
	checkMessage(true, ['setup', 'Setup data received:', '{"' + p_type + '":"' + p_boolTrueFalse + '"}']);
	checkMessage(true, ['setup', 'Changing ' + p_type + ' to: '+ p_boolTrueFalse]);
	checkMessage(true, ['setup', 'Reinitializing']);
}

//
// Set the ping / pong / other to be true.
//
function setTrue(p_type){
	_doSetupChange(p_type, true);
	doRegister(['1234']);
	waits(61000); // wait for > 1 min.	
}


