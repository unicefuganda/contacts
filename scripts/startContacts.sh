#!/bin/bash

while [ -z "`netstat -tln | grep -w 27017`" ]; do
  echo 'Waiting for MongoDB to start ...'
  sleep 1
  if [ $((timeout+=1)) -eq 10 ]; then
    break
  fi
done

cd /opt/app/contacts
npm start

