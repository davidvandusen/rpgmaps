#!/usr/bin/env bash

cd client
npm run build:prod
cp dist/play.js ../server/build/play.js
cp dist/edit.js ../server/build/edit.js
