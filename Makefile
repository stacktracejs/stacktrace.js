BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

deploy:
	npm publish

browser:
	open spec/spec-runner.html

phantom:
	/usr/bin/env DISPLAY=:1 phantomjs spec/lib/run-jasmine.js spec/spec-runner.html

jstd:
	/usr/bin/env DISPLAY=:1 java -jar spec/JsTestDriver-1.3.5.jar --config spec/jsTestDriver.conf --browser ${BROWSER_PATH} --port 4224 --tests 'all' --testOutput './target'

build: components
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
