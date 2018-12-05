#!/bin/bash

pushd docs

echo "Unlink all symlinks in doc/"
find . -type l | xargs -I{} unlink {}

echo "Regenerate symlinks in doc/"
DIRS=`find ../packages -name "README.md" -maxdepth 2 | xargs -I{} dirname {}`

for DIR in ${DIRS}; do
  echo -e "ln -s ${DIR}/README.md `basename ${DIR}`.md"
  ln -s ${DIR}/README.md `basename ${DIR}`.md
done

popd
