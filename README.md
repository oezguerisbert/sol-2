# Fullstack Application (for SOL-2)

This example shows how to implement a **fullstack app in TypeScript with [Next.js](https://nextjs.org/)** using [React](https://reactjs.org/), [Apollo Client](https://www.apollographql.com/docs/react/) (frontend), [Nexus Schema](https://nxs.li/components/standalone/schema) and [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client) (backend). It uses a SQLite database file with some initial dummy data which you can find at [`./prisma/dev.db`](./prisma/dev.db).

## Getting started

### Repository

Clone this repository:

```
git clone git@github.com:oezguerisbert/sol-2.git

```

### 1. Run the Setup-Script

Run the Setup/Script:

```sh

./setup.sh

```

### 2. Start the app

```
npm run dev
```

## Docker

You can also use Docker:

```sh
docker build -t <your-docker-image-name> .
```

And later on run the image via:

```sh
docker container run -p 3000:3000 <your-docker-image-name>
```

The app is now running, navigate to [`http://localhost:3000/`](http://localhost:3000/) in your browser to explore its UI.

# Screenshots:

![Homepage](./screenshots/homepage.png 'Homepage Screenshot')

![Login](./screenshots/login.png 'Login Screenshot')

![Rooms](./screenshots/rooms.png 'Rooms Screenshot')

![Dashboard](./screenshots/dashboard.png 'Dashboard Screenshot')

![Opening Times - Dashboard](./screenshots/dashboard-opening-times.png 'Opening Times - Dashboard Screenshot')

![Rooms - Dashboard](./screenshots/dashboard-rooms.png 'Rooms - Dashboard Screenshot')

![Statistics - Dashboard](./screenshots/dashboard-statistics.png 'Statistics - Dashboard Screenshot')

![Users - Dashboard](./screenshots/dashboard-users.png 'Users - Dashboard Screenshot')
