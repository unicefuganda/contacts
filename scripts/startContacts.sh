#!/bin/bash

while [ -z "`netstat -tln | grep mongod`" ]; do
  echo 'Waiting for MongoDB to start ...'
  sleep 1
done

cd /opt/app/contacts
npm start

