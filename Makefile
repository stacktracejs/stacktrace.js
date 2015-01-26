SHELL := /bin/bash
PATH := node_modules/.bin:./node_modules/karma/bin:$(PATH)

sources				:= stacktrace.js
minified            := $(sources:%.js=%.min.js)
source_map          := $(sources:%.js=%.js.map)
specs				:= $(wildcard spec/*-spec.js)
build_files			:= build/jshint.xml
direct_dependencies := node_modules/error-stack-parser/dist/error-stack-parser.min.js \
                       node_modules/stack-generator/dist/stack-generator.min.js \
                       node_modules/es6-promise/dist/es6-promise.min.js \
                       node_modules/stacktrace-gps/dist/stacktrace-gps.min.js
coveralls			:= node_modules/coveralls/bin/coveralls.js

build/jshint.xml: $(sources) $(specs)
	mkdir -p $(dir $@)
	jshint $^
	jshint --reporter checkstyle $^ > $@

test: $(build_files)
	@NODE_ENV=test karma start --single-run

test-ci: $(build_files)
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test karma start karma.conf.ci.js --single-run && \
		cat ./coverage/Chrome*/lcov.info | $(coveralls) --verbose

clean:
	rm -fr build coverage dist *.log

dist: $(build_files) $(sources) $(direct_dependencies)
	mkdir $@
	uglifyjs2 $(direct_dependencies) $(sources) -o $(minified) --source-map $(source_map)
	mv $(minified) $(source_map) $@
	cp $(sources) $@

ci: clean test-ci

all: clean test dist

.PHONY: all
