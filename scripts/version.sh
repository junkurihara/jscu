#!/bin/bash
#SEMVER_STRING=$1

# update packages' version. the root package would be always updated.
lerna version --no-push #$SEMVER_STRING

# update root version according the root version
NODE_COMMAND="const fs=require('fs'); const obj=JSON.parse(fs.readFileSync('$npm_package_root_package/package.json', 'utf8')); console.log(obj.version);"
ROOT_VERSION=`node -e "$NODE_COMMAND"`
npm version $ROOT_VERSION --no-git-tag-version
if [ $? = 0 ]; then
  echo "Start release process with 'yarn release:start' after git-commit."
else
  echo "Possibly nothing changed for packages. Simply do git-commit for develop branch."
fi