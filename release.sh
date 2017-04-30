#!/usr/bin/env bash

if [ $# -eq 0 ]
  then
    MAJOR=$(sed -n 's/^.*"version":.*"\(.*\)\..*\..*".*$/\1/p' ./package.json)
    MINOR=$(sed -n 's/^.*"version":.*".*\.\(.*\)\..*".*$/\1/p' ./package.json)
    UPDATE=$(sed -n 's/^.*"version":.*".*\..*\.\(.*\)".*$/\1/p' ./package.json)
    ((UPDATE++))
    V="$MAJOR.$MINOR.$UPDATE"
  else
    V=$1
fi

sed -i -bak "s/\"version\":.*,/\"version\": \"$V\",/g" ./package.json ./server/package.json ./client/package.json

git add ./package.json ./server/package.json ./client/package.json

git commit -m "Version ${V}"

git tag ${V}

echo "Updated to version $V"
