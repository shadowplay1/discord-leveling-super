# Contribution Guidelines

Thank you for your interest in contributing to `module-name`!

We value the effort and time put in by our contributors to make this package better.

This document outlines the guidelines and instructions for contributing to our project.

## Table of Contents
- [Contribution Guidelines](#contribution-guidelines)
	- [Table of Contents](#table-of-contents)
	- [Code of Conduct](#code-of-conduct)
	- [How Can I Contribute?](#how-can-i-contribute)
	- [Reporting Issues](#reporting-issues)
	- [Feature Requests](#feature-requests)
	- [Pull Requests](#pull-requests)
	- [Development Setup](#development-setup)
	- [Coding Guidelines](#coding-guidelines)
	- [Running Your Changes](#running-your-changes)
	- [Testing](#testing)
	- [Documentation](#documentation)
	- [Commit Guidelines](#commit-guidelines)

## Code of Conduct
Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) when participating in our project.

## How Can I Contribute?
There are several ways you can contribute to `module-name`:

- Reporting issues
- Submitting feature requests
- Creating pull requests to fix bugs or add new features
- Improving documentation
- Participating in discussions and providing feedback

## Reporting Issues
If you encounter any issues or bugs with `module-name`, please help us by reporting them. To report an issue, follow these steps:

1. Go to the [issue tracker](https://github.com/shadowplay1/module-name/issues) of the repository.
2. Click on the "New Issue" button.
3. Fill in the required details such as a clear and descriptive title, a detailed description of the issue, and steps to reproduce the problem.
4. Add any relevant labels or assignees to the issue.
5. Submit the issue.

## Feature Requests
If you have an idea for a new feature or improvement, we would love to hear about it. To submit a feature request, follow these steps:

1. Go to the [issue tracker](https://github.com/shadowplay1/module-name/issues) of the repository.
2. Click on the "New Issue" button.
3. Provide a clear and descriptive title for your feature request.
4. Describe the feature or improvement in detail, explaining why you think it would be valuable.
5. Add any relevant labels or assignees to the feature request.
6. Submit the feature request.

## Pull Requests
We welcome pull requests from contributors. To contribute code changes, follow these steps:

1. Fork the repository to your own GitHub account.
2. Create a new branch from the `main` branch for your changes.
3. Make your desired changes, ensuring they follow our **[coding guidelines](#coding-guidelines)**.
4. **Write/update** relevant **tests** for the changes made.
5. Update the **documentation** if needed.
6. Commit your changes with a clear and descriptive commit message following our **[commit guidelines](#commit-guidelines)**.
7. Push your changes to your branch in your forked repository.
8. Open a pull request against the `main` branch of the original repository.
9. Provide a clear description of the changes made and the rationale behind them based on the **pull request template**.
10. Make sure that **all** the CI/CD checks pass successfully. If not, then make the relevant changes to your code so all the checks would pass.
11. Wait for feedback and address any requested changes.

## Development Setup
To set up the development environment for `module-name`, follow these steps:

1. Fork the repository to your own GitHub account.
2. Clone the fork to your local machine:
```bash
$ git clone https://github.com/<your-github-username>/module-name
```

3. Create a new branch in your forked repository that will contain your changes:
```bash
$ git branch -b <new-branch-name>
```

4. Install the required dependencies:
```bash
$ npm install
```

5. Install MongoDB:
```bash
$ bash scripts/mongodb-install.sh
```

## Coding Guidelines
Please follow these coding guidelines when contributing to `module-name`:

- Write clean, readable, and maintainable code.
    - We use **ESLint** to lint our code, so it would be preferrable to install the **ESLint** extension for your code editor, so your changes would match the required code style to make the code for everyone __readable__ and __easy to understand__.
    - You can also run the `npm run lint:fix` to automatically fix all the fixable linting errors (such as __unnecessary spaces__, __unnecesary semicolons__, etc).
        - If there are arrors that the linter **cannot** fix automatically, they all will be printed in the console for you to fix them **manually**.
- Follow the existing code style and naming conventions.
- Document your code using appropriate comments.
- Avoid unnecessary code changes unrelated to the purpose of your contribution.

## Running Your Changes
There are 2 possible ways of you to run and test your changes:
1. Locally in any file in `misc/` directory (which is in `.gitignore` and shouldn't be committed). You can run and test your changes using the `ts-node misc/<file-name>.ts` command.
2. Straightly make your changes in the test file(s) - you can run the tests using the `npm test` command.

## Testing
We strive to maintain a high test coverage for `module-name`. When contributing, please ensure that your changes are covered by tests. To run the tests, use the command `npm test`.

## Documentation
Clear and concise documentation is essential for the usability of `module-name`. If you make changes that require documentation updates, please include them in your pull request.

## Commit Guidelines
When making commits to `module-name`, please follow these guidelines:

- Use clear and descriptive commit messages.
- Start the commit message with a verb in the present tense (e.g., "Add feature", "Fix bug").
- Keep the commit messages concise and focused on the specific changes made.

Thank you for your interest in contributing to `module-name`! Your contributions are highly appreciated and will help make this package even better.
