jscu: A Universal Cryptographic Library for JavaScript
--

[![CircleCI](https://circleci.com/gh/junkurihara/jscu.svg?style=svg)](https://circleci.com/gh/junkurihara/jscu)
[![Coverage Status](https://coveralls.io/repos/github/junkurihara/jscu/badge.svg?branch=develop)](https://coveralls.io/github/junkurihara/jscu?branch=develop)
[![Dependencies](https://david-dm.org/junkurihara/jscu.svg)](https://david-dm.org/junkurihara/jscu)
[![Maintainability](https://api.codeclimate.com/v1/badges/3e20cff0e8e062363a13/maintainability)](https://codeclimate.com/github/junkurihara/jscu/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

# Introduction

This repository is a *monorepo* of a universal cryptographic library for JavaScript called `js-crypto-utils` (`jscu`), which is designed so as to work in most modern browsers and Node.js. The detailed explanation would be given in each package repository. The root package is given [here](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-utils) (in `develop` branch), and we should start from there.

# For Developers

Usage of this monorepo and procedures for NPM deployment are summarized as follows.

- This monorepo is managed via [Yarn Workspace](https://yarnpkg.com/en/docs/workspaces) and [Lerna](https://github.com/lerna/lerna). After cloning this Git repo, just do `yarn install` at the root of the cloned folder. Then the setup is all done.
- Versioning pattern of each package is completely independent, but the version of this Git repository specified in the root `package.json` is tied with the root package, i.e., `packages/js-crypto-utils`. The name of root package is also given in the root `package.json`.
- Deployment of packages to NPM must be done through CircleCI, and **the deployment operation is only triggered by tags associated with Git repo version**. Any commits to any branch and any tags of individual package version won't kicks the deployment mechanism. The versioning and tagging would be done through the following combination of GitFlow and Lerna procedures.
  1. First execute `yarn flow:version` and bump a version of each package that has been modified on `develop` branch. Here we note that for each updated package, the updated tag would be committed (not pushed), and hence we should almost finalize the release operation at least for each package. This simultaneously update the repo version specified in the root `package.json` without committing.
  2. Add final changes for release at the level of GitHub repo. Then, commit changes and then execute `yarn release:start` to start release process on a release branch. Here we note the release version will be the updated Git repo version.
  3. To finalize the release operation, execute `yarn release:finish` to merge the release branch to `master`, and then merge `master` to `develop`. It will also tag the `master` branch with the updated Git repo version, i.e., the root package (`packages/js-crypto-utils`) version.
  4. Execute `yarn release:push` and push all branches and the generated tag of Git repo version to GitHub.