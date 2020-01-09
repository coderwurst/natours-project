# natours-project

## technologies

- Node.js
- Express.js
- PUG Templates
- mongodb

[Back To The Top](#read-me-template)

## installation

- to install dev data in local mongodb

```
node dev-data/data/import-dev-data.js --import
```

- to start app in dev mode on default port 3000

```
npm run start
```

- to start app in prod mode on default port 3000

```
npm run start:prod
```

- start parcel watch

```
npm run watch:js
```

## todos

- restrict users to only be able to add review to tours, which they have booked
- getAllreviews by user to be shown on my reviews page
- improve tour dates; participants count and sold out field
- user email confirmation
- refresh tokens to keep user logged in
- like tour functionality, with a favourites page
- admin page for admin restricted functionality
- deployment
- finishing payments with Stripe Hooks

## references

Jonas Schmedtmann's [Complete Bootcamp 2020](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp)
