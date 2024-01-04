# Git Commit Message Convention

> This is adapted from [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

Please follow this Git commit message convention when writing commit messages in your pull requests.


## Commit Message Format

Each commit message consists of a **header**, **body**, and **footer**.

```css
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The header has a **type**, **scope**, and **subject**. The header and footer are mandatory, but the body is optional.

The **subject** cannot end with a dot (.) and cannot have any capital letters, unless the commit mentions any part of the code (class, method, property, etc)

### Header

The header should have the following format: `(): `
- The **type** must be one of the following:
  - **feat**: A new feature
  - **fix**: A bug fix
  - **docs**: Documentation changes
  - **style**: Changes related to code style (formatting, etc.)
  - **refactor**: Code refactoring
  - **test**: Adding or modifying tests
  - **chore**: Chore work unrelated to the codebase - updating dependencies, linting, etc

- The **scope** indicates the module, component, or area that the changes affect. It is optional but recommended.
- The **subject** is a short, descriptive summary of the changes. It should be written in the imperative mood and begin with a capital letter.


### Body

The body provides a more detailed description of the changes. It should explain the reasoning behind the changes and any additional information that might be relevant. It can be skipped if the commit message is self-explanatory.


### Footer

The footer should contain any associated issue or pull request numbers using the following format:

```ts
Issue #<issue_number>
PR #<pull_request_number>
```

Multiple issues or pull requests can be referenced by separating them with commas.


## Examples

### Commit with a scope

- This commit adds a `pull` method in some database class:

```ts
feat(database): 'pull' method added
```


- This commit adds a `pull` method in `QuickMongo` class:
```ts
feat(QuickMongo): 'pull' method added
```


- This commit fixes the `pull` method not working in `QuickMongo` class:
```ts
fix(QuickMongo): 'pull' method not working
```


- This commit bumps the `mongoose` dependency to the latest version:
```ts
chore(deps): bumped 'mongoose' to the latest version
```


### Commit without a scope
```ts
fix: failing to connect to mongodb
```

The module was failing to connect to MongoDB. This commit fixes it.


### Commit with a body

```ts
docs: update README.md

This commit updates the README.md file of the project with improved formatting and additional information on how to contribute.
```

### Commit with a footer

```ts
fix: resolve issue with mongodb connection

Issue #123
PR #456
```

## Additional Guidelines

- Each commit should represent a logical, self-contained unit of work.
- Commit messages should be concise, clear, and specific.
- Avoid using special characters in commit messages, except for punctuation.
- Use present tense in the subject line and imperative mood for the verb.
- Referencing issues or pull requests in the footer helps track their association with commits.

Following this commit convention makes it easier for everyone to understand and track the changes in the project's history.

Thank you for contributing!
