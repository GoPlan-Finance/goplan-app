# Contributing to GoPlan

We want to make contributing to this project as easy and transparent as possible.

If you're looking to get started, but want to ease yourself into the codebase, look for issues tagged [good first issue](https://github.com/GoPlan-Finance/GoPlan-app/labels/good%20first%20issue). These are simple yet valuable tasks that should be easy to get started.

## `master` is unsafe

Our goal is to keep `master` stable, but there may be changes that your application may not be compatible with. We'll do our best to publicize any breaking changes, but try to use our specific releases in any production environment.

## Setting up the project for debugging and contributing:

### Recommended setup:

* T
* B
* D

### Setting up you local machine:

* [Fork](https://github.com/GoPlan-Finance/GoPlan-app) this project and clone the fork on your local machine:

```sh
$ T
$ B
$ D
```

### Building the application

The project is built in two parts

- The BackEnd
- The FrontEnd

When developing the SDK you can use `npm run watch` in order to rebuild your changes upon each save.

### Testing the code

The SDK is tested through  TBD

#### Unit tests

TBD

#### Integration tests

TBD


### Pull Requests

We actively welcome your pull requests. When we get one, we'll run some integration tests on it first. From here, we'll need to get a core member to sign off on the changes and then merge the pull request. For API changes we may need to fix internal uses, which could cause some delay. We'll do our best to provide updates and feedback throughout the process.

1. Fork the repo and create your branch from `master`.
2. Add unit tests for any new code you add.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes. (TBD Run `npm test && npm run integration`)
5. Make sure your code lints.

### Known Issues

We use GitHub issues to track public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new issue, try to make sure your problem doesn't already exist.

### Reporting New Issues

Details are key. The more information you provide us the easier it'll be for us to debug and the faster you'll receive a fix. Some examples of useful tidbits:

* A description. What did you expect to happen and what actually happened? Why do you think that was wrong?
* A simple unit test that fails.
* What version does this reproduce on? What version did it last work on?
* Anything else you find relevant.

### Security Bugs

TBD GoPlan has a [responsible Vulnerability Disclosure Program](https://github.com/GoPlan-Finance/GoPlan-app/blob/master/SECURITY.md) for the safe disclosure of security bugs. In those cases, please go through the process outlined on that page and do not file a public issue.

## Coding Style

* Most importantly, match the existing code style as much as possible.
* We use [Flow](http://flowtype.org/) and ES6 for this codebase. Use modern syntax whenever possible.
* Keep lines within 140 characters.

### Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://github.com/GoPlan-Finance/GoPlan-app/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to honor this code.

## License

By contributing to the GoPlan application, you agree that your contributions will be licensed under its license.
