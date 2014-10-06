Contacts
========

[![Build Status](https://snap-ci.com/unicefuganda/contacts/branch/master/build_image)](https://snap-ci.com/unicefuganda/contacts/branch/master)

[![Coverage Status](https://img.shields.io/coveralls/unicefuganda/contacts.svg)](https://coveralls.io/r/unicefuganda/contacts)

Cross cutting contacts service for UNICEF Uganda. Currently used for th UNICEF End User Monitoring Tool

# Developer Setup

Install [MongoDB](https://www.mongodb.org/downloads#packages)

[Optional] Install [Node Version Manager](https://github.com/creationix/nvm) nvm

Install [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)

Install **Node Package Manager**

To install node package dependencies
> npm install

To run tests (ensure mongod process is running)
> npm test

To run the node server
> npm start

# API

The api runs on port **8005** by deault or on the port designated when starting the service
Accessing the api root on localhost would be **http://localhost:8005/api**

Viewing all contacts uses the endpoint **http://localhost:8005/api/contacts**
