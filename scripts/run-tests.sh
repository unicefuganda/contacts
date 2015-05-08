#!/bin/bash

npm install
npm install grunt-coveralls
echo repo_token: $COVERALLS_REPO_TOKEN >> .coveralls.yml
npm test
grunt coveralls:grunt_coveralls_coverage
