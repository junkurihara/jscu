jscu: A Universal Cryptographic Library for JavaScript
--

[![CircleCI](https://circleci.com/gh/junkurihara/jscu.svg?style=svg)](https://circleci.com/gh/junkurihara/jscu)
[![Coverage Status](https://coveralls.io/repos/github/junkurihara/jscu/badge.svg?branch=develop)](https://coveralls.io/github/junkurihara/jscu?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/3e20cff0e8e062363a13/maintainability.svg)](https://codeclimate.com/github/junkurihara/jscu/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

> **NOTE**: This repository is a *monorepo* of a universal cryptographic library for JavaScript called `js-crypto-utils` (`jscu`), which is designed so as to work in most modern browsers and Node.js. The detailed explanation would be given in each package repository. The root package is given [here](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-utils) (in `develop` branch).

# Introduction and Overview
This project called `jscu` is being developed to provide unified cryptographic APIs for browsers and Node.js. There currently exist various sophisticated cryptographic suites for JavaScript that are implemented as native functions, e.g., WebCrypto API and `crypto` in Node.js. However, they have different interfaces and are NOT supported at all platforms. For instance, FireFox cannot be fed PKCS8-formatted private key in WebCrypto API but Chrome does. On the other hand, such suites have not been designed to keep compatibility to existing non-Web cryptographic suites like OpenSSL. This can be seen from the fact that WebCrypto API does not support PEM-formatted keys. Hence we (actually I!) need to write ugly codes so as to enable apps to work in various environments. From this observation, we aim that this library provides support functions to fill such gaps among JS cryptographic suites and that between JavaScript and other popular crypto suites.

Firstly, this library provides following functions that works in most modern browsers and Node.js.
- ECDSA signing, verification, key generation (P-256/P-384/P-521/P-256K)
- RSA-PSS/RSASSA-PKCS1-v1_5 signing, verification, key generation.
- Encryption using ECDH and HKDF.
- Encryption using RSA-OAEP. 
- Public/private key format conversion between JWK and PEM/DER (SPKI for public/PKCS8 for private)
- Generation of JWK Thumbprint
- Generation of X.509 public key certificate from JWK and extraction of JWK public key from X.509 public key certificate.
Additionally, this library provides random, hash, AES, HMAC, HKDF, and PBKDF functions. 


# For Developers

Usage of this monorepo and procedures for NPM deployment are summarized as follows.

- This monorepo is managed via [Yarn Workspace](https://yarnpkg.com/en/docs/workspaces) and [Lerna](https://github.com/lerna/lerna). After cloning this Git repo, just do `yarn install` at the root of the cloned folder. Then the setup is all done.
- Versioning pattern of each package is completely independent, but the version of this Git repository specified in the root `package.json` is tied with the root package, i.e., `packages/js-crypto-utils`. The name of root package is also given in the root `package.json`.
- Deployment of packages to NPM must be done through CircleCI, and **the deployment operation is only triggered by tags associated with Git repo version**. Any commits to any branch and any tags of individual package version won't kicks the deployment mechanism. The versioning and tagging would be done through the following combination of GitFlow and Lerna procedures.
  1. First execute `yarn flow:version` and bump a version of each package that has been modified on `develop` branch. Here we note that for each updated package, the updated tag would be committed (not pushed), and hence we should almost finalize the release operation at least for each package. This simultaneously update the repo version specified in the root `package.json` without committing.
  2. Add final changes for release at the level of GitHub repo. Then, commit changes and then execute `yarn release:start` to start release process on a release branch. Here we note the release version will be the updated Git repo version.
  3. To finalize the release operation, execute `yarn release:finish` to merge the release branch to `master`, and then merge `master` to `develop`. It will also tag the `master` branch with the updated Git repo version, i.e., the root package (`packages/js-crypto-utils`) version.
  4. Execute `yarn release:push` and push all branches and the generated tag of Git repo version to GitHub.