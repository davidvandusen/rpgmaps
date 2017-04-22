#!/usr/bin/env bash

cd client
npm run build:prod
cp dist/*.js ../server/build/
