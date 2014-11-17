BROWSERS=Firefox,ChromeCanary,Opera

test: build/jshint.xml
	@NODE_ENV=test ./node_modules/karma/bin/karma start --single-run --browsers $(BROWSERS)

build/jshint.xml: build
	./node_modules/.bin/jshint --reporter checkstyle ./spec/stacktrace-spec.js ./stacktrace.js > build/jshint.xml

test-ci: build/jshint.xml
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/karma/bin/karma start karma.conf.ci.js --single-run && \
    		cat ./coverage/Chrome*/lcov.info | ./node_modules/coveralls/bin/coveralls.js --verbose

clean:
	rm -fr build coverage dist *.log

build:
	mkdir build

dist:
	mkdir dist
	./node_modules/.bin/uglifyjs2 \
		node_modules/error-stack-parser/dist/error-stack-parser.min.js \
		node_modules/stack-generator/dist/stack-generator.min.js \
		node_modules/stacktrace-gps/dist/stacktrace-gps.min.js \
		stacktrace.js -o stacktrace.min.js --source-map stacktrace.js.map
	mv stacktrace.min.js stacktrace.js.map dist/

.PHONY: clean test dist
