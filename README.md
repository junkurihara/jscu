jscu: A Universal Cryptographic Library for JavaScript
--

[![CircleCI](https://circleci.com/gh/junkurihara/jscu.svg?style=svg)](https://circleci.com/gh/junkurihara/jscu)
[![codecov](https://codecov.io/gh/junkurihara/jscu/branch/develop/graph/badge.svg)](https://codecov.io/gh/junkurihara/jscu)
[![Maintainability](https://api.codeclimate.com/v1/badges/3e20cff0e8e062363a13/maintainability.svg)](https://codeclimate.com/github/junkurihara/jscu/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WARNING**: At this time this solution should be considered suitable for research and experimentation, further code and security review is needed before utilization in a production application.

> **NOTE**: This repository is a *monorepo* of a universal cryptographic library for JavaScript called `js-crypto-utils` (`jscu`), which is designed so as to work in most modern browsers and Node.js. The detailed explanation would be given in each package repository. The root package is given [here](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-utils) (in `develop` branch).

> **Terminated to support MS IE11 and released v1.0 (Sep. 30, 2020).**

# Introduction and Overview of this monorepo
This project called `jscu` is being developed to provide unified cryptographic APIs for browsers and Node.js. There currently exist various sophisticated cryptographic suites for JavaScript that are implemented as native functions, e.g., WebCrypto API and `crypto` in Node.js. However, they have different interfaces and are NOT supported at all platforms. For instance, FireFox cannot be fed PKCS8-formatted private key in WebCrypto API but Chrome does. On the other hand, such suites have not been designed to keep compatibility to existing non-Web cryptographic suites like OpenSSL. This can be seen from the fact that WebCrypto API does not support PEM-formatted keys. Hence we (actually I!) need to write ugly codes so as to enable apps to work in various environments. From this observation, we aim that this library provides support functions to fill such gaps among JS cryptographic suites and that between JavaScript and other popular crypto suites.

In particular, this library provides unified APIs of the following cryptographic functions that works in most modern browsers and Node.js.

- ECDSA signing, verification, key generation (P-256/P-384/P-521/P-256K)
- RSA-PSS/RSASSA-PKCS1-v1_5 signing, verification, key generation.
- Encryption using ECDH and HKDF.
- Encryption using RSA-OAEP. 
- Public/private key format conversion between JWK and PEM/DER (SPKI for public/PKCS8 for private)
- Generation of JWK Thumbprint
- Generation of X.509 public key certificate from JWK and extraction of JWK public key from X.509 public key certificate.

Additionally, this library provides random, hash, AES, HMAC, HKDF, and PBKDF functions. This implies the `jscu` is composed of the several subpackages and can be seen as a cryptographic suite like [`openpgpjs`](https://openpgpjs.org/). The root package, `js-crypto-utils`, of the suite and its subpackages are listed as follows.

- [`crypto-utils`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-utils): Root cryptographic package providing unified APIs.
- [`x509-utils`](https://github.com/junkurihara/jscu/tree/develop/packages/js-x509-utils): Subpackage handling X509 certificates.
- [`key-utils`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-key-utils): Subpackage handling various key formats like PEM, DER, and JWK.
- [`ec`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-ec): Subpackage providing naive encryption and signing of elliptic curve cryptography.
- [`rsa`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-rsa): Subpackage providing naive encryption and signing of RSA cryptography. 
- [`aes`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-aes): Subpackage for AES encryption.
- [`random`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-random): Subpackage for cryptographic random generator.
- [`hash`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-hash): Subpackage providing hash functions including SHA-2 and SHA-3.
- [`hkdf`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-hkdf): Subpackage providing hash-based key derivation function.
- [`pbkdf`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-pbkdf): Subpackage providing password-based key derivation function 1 and 2.
- [`hmac`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypto-hmac): Subpackage providing hash-based message authentication code.

The structure of the package is described in the README.md of the [root package](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypt-utils), and hence we should start from there. But we can use various cryptographic functions not only via the root package, [`js-crypto-utils`](https://github.com/junkurihara/jscu/tree/develop/packages/js-crypt-utils), but also by directly importing subpackages of intended functions. We should refer to README.md of each subpackage for its detailed usage.

# For Developers and Contributors

Using `npm` package is the simplest way to fully leverage `jscu` functions. Considering you fork, develop, and update `jscu` packages themselves, i.e., as developers and contributors, usage of this monorepo and procedures for NPM deployment are summarized as follows.

- This monorepo is managed via [Yarn Workspace](https://yarnpkg.com/en/docs/workspaces) and [Lerna](https://github.com/lerna/lerna). After cloning this Git repo, just do `yarn install` at the root of the cloned folder. Then the setup is all done.
- Versioning pattern of each package is completely independent, but the version of this Git repository specified in the root `package.json` is tied with the root package, i.e., `packages/js-crypto-utils`. The name of root package is also given in the root `package.json`.
- Deployment of packages to NPM must be done through CircleCI, and **the deployment operation is only triggered by tags associated with Git repo version**. Any commits to any branch and any tags of individual package version won't kicks the deployment mechanism. The versioning and tagging would be done through the following combination of GitFlow and Lerna procedures.
  1. First execute `yarn flow:version` and bump a version of each package that has been modified on `develop` branch. Here we note that for each updated package, the updated tag would be committed (not pushed), and hence we should almost finalize the release operation at least for each package. This simultaneously update the repo version specified in the root `package.json` without committing.
  2. Add final changes for release at the level of GitHub repo. Then, commit changes and then execute `yarn release:start` to start release process on a release branch. Here we note the release version will be the updated Git repo version.
  3. To finalize the release operation, execute `yarn release:finish` to merge the release branch to `master`, and then merge `master` to `develop`. It will also tag the `master` branch with the updated Git repo version, i.e., the root package (`packages/js-crypto-utils`) version.
  4. Execute `yarn release:push` and push all branches and the generated tag of Git repo version to GitHub.

# Contributing

`jscu` is free, open source software licensed under MIT License.

You can open issues for bugs you've found or features you think are missing. You can also submit pull requests to this repository.

Contributors are more than welcome!

# Documentation
The [`jscu` documentation](https://junkurihara.github.io/jscu-webpage/) is a dynamically generated site from this monorepo via [esdoc](https://esdoc.org/). You can submit pull requests to 'docs' of this monorepo for document update.
