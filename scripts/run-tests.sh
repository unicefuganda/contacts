#!/bin/bash

set -e

npm install
npm install grunt-coveralls
echo repo_token: $COVERALLS_REPO_TOKEN >> .coveralls.yml
PORT=8006 npm test
#PORT=8006 grunt coveralls:grunt_coveralls_coverage
