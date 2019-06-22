# Northcoders News API

This repository contains a RESTful API, for a Reddit-style website called Northcoders News. Northcoders News has a database of articles created by users and allows for comments to be added to articles. Both of articles and comments can be upvoted or downvoted by users.

You can visit the hosted project [here](https://marco-iann-nc-news-api.herokuapp.com/api/), hosted on [Heroku](https://dashboard.heroku.com/)

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

### Running the tests

You can run all test with a single script:

```
npm test
```

### Running dev server

```
npm run dev
```

### Example usage

Request

```
GET /api/topics
```

Servers an array of all the topics

```
"exampleResponse": {
  "topics": [
    { "slug": "football", "description": "Footie!" },
    { "slug": "coding", "description": "code is love, code is life" }
  ]
}
```

Request

```
POST /api/topics
```

Adds a new topic to the database

```
"requestBody": {
  "slug": "javascript",
  "description": "everything related to javascript"
},
"exampleResponse": {
  "topic": {
    "slug": "javascript",
    "description": "everything related to javascript"
  }
}
```

Request

```
GET /api/topics/:slug
```

Serves details about a specified topic

```
"exampleResponse": {
  "topic": { "slug": "football", "description": "Footie!" }
}
```

Request

```
GET /api/articles
```

Serves an array of all articles

```
"queries": ["sort_by", "order", "author", "topic", "limit", "p"],
"exampleResponse": {
  "articles_count": 2,
  "articles": [
    {
      "author": "weegembump",
      "title": "Seafood substitutions are increasing",
      "topic": "cooking",
      "created_at": "2018-05-30T15:59:13.341Z",
      "votes": 0,
      "article_id": 33,
      "comment_count": "6"
    },
    {
      "author": "happyamy2016",
      "title": "High Altitude Cooking",
      "topic": "cooking",
      "created_at": "2018-05-27T03:32:28.514Z",
      "votes": 0,
      "article_id": 28,
      "comments_count": "5"
    }
  ]
}
```

Request

```
POST /api/articles
```

Adds an article to the database

```
"requestBody": {
  "username": "grumpy19",
  "body": "Consectetur deleniti sed.",
  "title": "Nobis consequatur animi",
  "topic": "coding"
},
"exampleResponse": {
  "comment": {
    "author": "grumpy19",
    "article_id": 2,
    "topic": "coding",
    "title": "Nobis consequatur animi",
    "body": "Consectetur deleniti sed.",
    "votes": 0,
    "created_at": "2019-05-19T19:33:48.673Z"
  }
}
```

Request

```
GET /api/articles/:article_id
```

Finds an article by its id and serves it as an object

```
"exampleResponse": {
  "article": {
    "author": "tickle122",
    "title": "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
    "topic": "cooking",
    "created_at": "2017-03-11T13:20:18.573Z",
    "votes": 0,
    "article_id": 29,
    "body": "In 1686, the croissant was invented in Austria",
    "comments_count": "10"
  }
}
```

Request

```
PATCH /api/articles/:article_id
```

Updates number of votes of an article

```
"requestBody": { "inc_votes": 1 },
"exampleResponse": {
  "article": {
    "article_id": 29,
    "title": "A BRIEF HISTORY OF FOOD—NO BIG DEAL",
    "body": "In 1686, the croissant was invented in Austria. That's a fun fact I'd probably never had known or maybe don't even really need to know, but now I do, thanks to Julia Rothman's Food Anatomy: The Curious Parts & Pieces of Our Edible World. Rothman has an entire series of illustrated Anatomy books, including Nature and Farm, packed with infographics, quirky facts, and maps that you can get lost in for hours—in a fun way, not in a boring textbook way. It makes you wonder why textbooks aren't this fun to read. Can someone look into this? Thanks.",
    "votes": 1,
    "topic": "cooking",
    "author": "tickle122",
    "created_at": "2017-03-11T13:20:18.573Z"
  }
}
```

Request

```
DELETE /api/articles/:article_id
```

Deletes selected article and all its comments

Request

```

GET /api/articles/:article_id/comments

```

Serves an array of all the comments to the selected article

```

"queries": ["sort_by", "order", "author", "limit"],
"exampleResponse": {
"comments": [
{
"author": "grumpy19",
"body": "Error est qui id corrupti et quod enim accusantium minus. Deleniti quae ea magni officiis et qui suscipit non.",
"votes": 4,
"comment_id": 44,
"created_at": "2017-11-20T08:58:48.322Z"
},
{
"author": "jessjelly",
"body": "Consectetur deleniti sed. Omnis et dolore omnis aspernatur. Et porro accusantium. Tempora ullam voluptatum et rerum.",
"votes": 10,
"comment_id": 52,
"created_at": "2017-07-31T08:14:13.076Z"
}
]
}

```

Request

```
POST /api/articles/:article_id/comments
```

Adds a comment to an article

```
"requestBody": {
  "username": "grumpy19",
  "body": "Consectetur deleniti sed."
},
"exampleResponse": {
  "comment": {
    "comment_id": 301,
    "author": "grumpy19",
    "article_id": 2,
    "body": "Consectetur deleniti sed.",
    "votes": 0,
    "created_at": "2019-05-19T19:33:48.673Z"
  }
}
```

Request

```
GET /api/comments/:comment_id
```

Find a comment by its id and serves it as an object

```

"exampleResponse": {
  "comment": {
    "comment_id": 2,
    "author": "grumpy19",
    "article_id": 4,
    "body": "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
    "votes": 7,
    "created_at": "2016-11-10T21:26:49.256Z"
  }
}
```

Request

```
PATCH /api/comments/:comment_id
```

Updates number of votes of a comment

```
"requestBody": { "inc_votes": 1 },
"exampleResponse": {
  "comment": {
    "comment_id": 2,
    "author": "grumpy19",
    "article_id": 4,
    "body": "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
    "votes": 8,
    "created_at": "2016-11-10T21:26:49.256Z"
  }
}
```

Request

```
DELETE /api/comments/:comment_id
```

Deletes selected comment

Request

```
GET /api/users
```

Serves an array of all users

```
"exampleResponse": {
  "users": [
    {
      "username": "tickle122",
      "avatar_url": "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      "name": "Tom Tickle"
    },
    {
      "username": "grumpy19",
      "avatar_url": "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg",
      "name": "Paul Grump"
    }
  ]
}
```

Request

```
POST /api/users/
```

Adds a new user to the database

```
"requestBody": {
  "username": "tickle122",
  "avatar_url": "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
  "name": "Tom Tickle"
},
"exampleResponse": {
  "user": {
    "username": "tickle122",
    "avatar_url": "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
    "name": "Tom Tickle"
  }
}
```

Request

```
GET /api/users/:username
```

Finds a user by its username

```
"exampleResponse": {
  "user": {
    "username": "tickle122",
    "avatar_url": "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
    "name": "Tom Tickle"
  }
}

```

## Built With

- [Npm](https://www.npmjs.com/) - Dependency management
- [ExpressJS](https://expressjs.com/) - The web framework used
- [KnexJS](https://knexjs.org/) - Query builder

## Author

- **Marco F. Iannuzzi** - _Initial work_ - [marco-iann](https://github.com/marco-iann)
