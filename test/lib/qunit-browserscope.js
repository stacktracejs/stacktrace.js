var _bTestResults = {};

// Add URL option in QUnit to toggle publishing results to BrowserScope.org
QUnit.config.urlConfig.push("publish");
QUnit.config.testTimeout = 1000; // Timeout for async tests

// Prevent overwriting other hooks
if (typeof QUnit.testDone === 'function') {
	QUnit.oldTestDone = QUnit.testDone;
}
if (typeof QUnit.done === 'function') {
	QUnit.oldDone = QUnit.done;
}

// Build-up the test results beacon for BrowserScope.org
QUnit.testDone = function(test) {
	QUnit.oldTestDone && QUnit.oldTestDone(test);
	// make sure all assertions passed successfully
	if (!test.failed && test.total === test.passed) {
		_bTestResults[test.name] = 1;
	} else {
		_bTestResults[test.name] = 0;
	}
}

// If the user agreed to publish results to BrowserScope.org, go for it!
QUnit.done = function(result) {
	QUnit.oldDone && QUnit.oldDone(result);
	if (QUnit.config.publish) {
		var testKey = 'agt1YS1wcm9maWxlcnINCxIEVGVzdBjr68MRDA';
		var newScript = document.createElement('script');
		var firstScript = document.getElementsByTagName('script')[0];

		newScript.src = 'http://www.browserscope.org/user/beacon/' + testKey + "?callback=showResults";
		firstScript.parentNode.insertBefore(newScript, firstScript);
	}
}

// Load the results widget from browserscope.org
function showResults() {
	var script = document.createElement('script');
	script.src = "http://www.browserscope.org/user/tests/table/agt1YS1wcm9maWxlcnINCxIEVGVzdBjr68MRDA?o=js";
	document.body.appendChild(script);
}