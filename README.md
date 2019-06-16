# Northcoders News API

This repository contains a RESTful API, for a Reddit-style website called Northcoders News. Northcoders News has a database of articles created by users and allows for comments to be added to articles. Both of articles and comments can be upvoted or downvoted by users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Check that you have [NodeJS](https://nodejs.org/en/) installed:

```
node --version
```

Check that you have [PostgreSQL](https://www.postgresql.org/) installed:

```
psql --version
```

Check that you have [git](https://git-scm.com/) installed:

```
git --version
```

### Installing

Clone this repository:

```
git clone https://github.com/marco-iann/nc-news-api.git
```

Navigate to the repository folder, then install npm packages

```
npm install
```

If running on Linux based os:

Create a dbConfig.js file in the root directory and add the following line

```
module.exports = { username: 'username', password: 'password' };
```

With username and password being your psql username and password

## Running the tests

You can run all test with a single script:

```
npm test
```

## Running dev server

```
npm run dev
```

## Built With

- [Npm](https://www.npmjs.com/) - Dependency management
- [ExpressJS](https://expressjs.com/) - The web framework used
- [KnexJS](https://knexjs.org/) - Query builder

## Author

- **Marco F. Iannuzzi** - _Initial work_ - [marco-iann](https://github.com/marco-iann)

## Todo

- Add description of endpoints with response examples to the readme
