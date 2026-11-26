#!/bin/bash

NPMDIRS=`find ./packages -maxdepth 2 -type f -name "package.json" | sed "s/\(\.\/.*\)\/package.json/\1/g"`

for DIR in ${NPMDIRS}; do
  echo -e "\n-- ${DIR} --"
  pushd $DIR
  ../../node_modules/.bin/can-npm-publish --verbose
  if [[ $? = 0 ]]; then
    # Authentication is done by npm Trusted Publishing (OIDC) in GitHub Actions.
    echo "Publish updated package"
    npm publish
  else
    echo "No need to update"
  fi
  popd
done