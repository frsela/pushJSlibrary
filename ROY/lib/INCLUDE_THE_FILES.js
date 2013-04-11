//============================================================================================================
//
// Includes for the test runner.
//


//----------------- Jasmine and other development dependencies.
//

//
// Jasmine itself (just need the 'lib/' files from the latest release to be in this folder).
//
document.write('<script type="text/javascript" src="./lib/jasmine/jasmine.js"></script>');

//
// JQuery (just handy!) - using the online version so it's always the latest ..
//
document.write('<script type="text/javascript" src="http://code.jquery.com/jquery.min.js"></script>');



//----------------- Reporters used by Jasmine to report the results in different ways.
//

//
// STANDARD reporter.
//
document.write('<link rel="stylesheet" href="./lib/jasmine/jasmine.css" type="text/css">');
document.write('<script type="text/javascript" src="./lib/jasmine/jasmine-html.js"></script>');

//
// BOOTSTRAP reporter (looks much nicer in a browser, but on a mobile device this is rubbish,
// so use the STANDARD reporter for mobile devices.
//
document.write('<link rel="stylesheet" href="./lib/jasmine_bootstrap_reporter/bootstrap.css" type="text/css">');
document.write('<link rel="stylesheet" href="./lib/jasmine_bootstrap_reporter/jasmine-bootstrap.css" type="text/css">');
document.write('<script type="text/javascript" src="./lib/jasmine_bootstrap_reporter/jasmine-bootstrap.js"></script>');

//
// CUSTOM reporter (for creating a report file on the server).
//
//document.write('<script type="text/javascript" src="./lib/jasmine_server_reporter/updateServerFile.js"></script>');
//document.write('<script type="text/javascript" src="./lib/jasmine_server_reporter/server_reporter.js"></script>');



//----------------- The PUSH server scripts used by these tests.
//

//
// PUSH custom functions  etc...
//
document.write('<script type="text/javascript" src="../library/html.js"></script>');
document.write('<script type="text/javascript" src="../library/push.js"></script>');



//----------------- The automated test code (written in Jasmine + JS).
//

//
// Test cases.
//
document.write('<script type="text/javascript" src="./lib/common_test_functions.js"></script>');
document.write('<script type="text/javascript" src="./TestCases.js"></script>');
