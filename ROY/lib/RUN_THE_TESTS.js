//
// NOTE:
// =====
// The custom reporter won't work while we're using the "file:///"
// extension to load the page because of security - we need to be 
// using "http://".
// It may also require Apache or some other 'proper' webserver
// for the php part.
//

//
// 'Standard' Jasmine + custom reporter
//
//(function() {
//	var jasmineEnv = jasmine.getEnv();
//	jasmineEnv.updateInterval = 1000;
//
//	var trivialReporter = new jasmine.TrivialReporter();
//	var customReporter     = new customReporter();
//	
//    jasmineEnv.addReporter(trivialReporter);
//    jasmineEnv.addReporter(customReporter);
//    
//	jasmineEnv.specFilter = function(spec) {
//		return trivialReporter.specFilter(spec);
//	};
//	
//	//customReporter.onRunnerFinished(function (text) {
//    //      updateServerFile("./test_results.txt", text);
//    //});
//
//	
//	window.onload = function() {
//	    jasmineEnv.execute();
//	};
//
//})();

//
// 'Bootstrap' Jasmine + custom reporter.
//
(function() {
	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var bootstrapReporter = new jasmine.BootstrapReporter();
//	var customReporter    = new customReporter();
	
//  jasmineEnv.addReporter(customReporter);
    jasmineEnv.addReporter(bootstrapReporter);
	jasmineEnv.specFilter = function(spec) {
		return bootstrapReporter.specFilter(spec);
	};
	
//	customReporter.onRunnerFinished(function (text) {
////          updateServerFile("./test_results.txt", text);
//    });

	window.onload = function() {
	    jasmineEnv.execute();
	};

})();