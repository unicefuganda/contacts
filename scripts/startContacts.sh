#!/bin/bash

while [ -z "`netstat -tln | grep 27017`" ]; do
  echo 'Waiting for MongoDB to start ...'
  sleep 1
done

cd /opt/app/contacts
npm start

