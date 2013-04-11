var g_prevSuites = [];

function customReporter() {
    this.textResult = "SPEC DESCRIPTION\tRESULT\r\n";
}

customReporter.prototype = new jasmine.Reporter();

customReporter.prototype.onRunnerFinished = function (callback) {
    this.callbackEnd = callback;
};

customReporter.prototype.reportRunnerResults = function (runner) {        
    // When all the spec are finished //
    var result = runner.results();
    var numFailed = (result.totalCount - result.passedCount);
  
    this.textResult += "\r\n\r\n";
    this.textResult += "Test result summary: ";
    
    if (numFailed == 0){
    	this.textResult += "All tests passed.";
    }
    else if (numFailed == 1){
    	this.textResult += "1 test failed.";
    }
    else{
    	this.textResult += numFailed + " tests failed.";
    }
    this.textResult += "\r\n";

    if (this.callbackEnd) {
        this.callbackEnd(this.textResult);
    }
};

customReporter.prototype.reportSpecResults = function(spec) {
    var result	= spec.results();
    var suite 	= spec.getFullName();
    var arrLen 	= g_prevSuites.length;

    // Chop the spec description off the end of our suite description.
	suite = suite.substring(0,(suite.length - spec.description.length - 2));
	
	var parentSuiteLen 	= 0;
	var tmpArr 			= [];
	var padding			= "";
    for (var i=0; i < arrLen; ++i){
    	var prevSuite = g_prevSuites[i];
    	var matchPos = suite.indexOf(prevSuite);

    	if (matchPos > -1 && prevSuite.length > 0){
    		
    		// This is a parent suite - put it back in the array.
    		tmpArr.push(prevSuite);
    		
    		parentSuiteLen = parentSuiteLen + prevSuite.length;
    	
    		// Add a little padding to show this is a child
    		padding += "    ";
		}
    	else{
    		// This is not a parent, so forget everything else.
    		break;
    	}
	}
    
	// Chop the text of it off our suite.
	suite = suite.substring(parentSuiteLen);

	// Set the the array of previous suites (as it now is).
    g_prevSuites = tmpArr;

    this.textResult += "\r\n";
    
    if (suite.length > 0){
	    // Add our suite to it too.
		g_prevSuites.push(suite);
		
		// Pad for this suite.
		padding += "    ";
	    
		this.textResult += padding + suite + "\r\n";
    }
    
	this.textResult += padding + "    - " + spec.description + "\t\t\t" + (result.passed() ? "passed" : "FAILED");
	
};
