# V-DOC

- Frontend
  - [Typescript](https://www.typescriptlang.org/)
  - [Next.js](https://nextjs.org/)
  - [MaterialUI](https://material-ui.com/)
  - [React-Hook-Form](https://react-hook-form.com/)
  - [ESlint](https://eslint.org/) / [Prettier](https://prettier.io/)
- Backend
  - [Next.js / api](https://nextjs.org/docs/api-routes/introduction)
  - [Prisma](https://www.prisma.io/)
  - [PostgreSQL](https://www.postgresql.org/)
- Testing - comming soon
- Containerization
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

## Prerequisite

- Node.js - version 16 and above
  - Installation
    - [Windows / MacOS](https://nodejs.org/en/download/)
    - [Debian and Ubuntu based Linux distributions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
    ```shell
    sudo apt install nodejs
    ```
    or use node-version-manager like [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n)
- PostgreSQL (optional)
  - Installation
    - [Windows](https://www.postgresql.org/download/windows/)
    - [MacOS](https://www.postgresql.org/download/macosx/)
    - [Linux distros](https://www.postgresql.org/download/linux/)
    - [Docker](https://hub.docker.com/_/postgres)

## Initial setup

Install project dependencies

```shell
npm install
```

Start Postgre + PGadmin as containers

```
docker compose up --build -d
```

Run db migrations with prisma

```
npm run migrate:dev
```

Generate prisma client after migrations

```
npm run generate
```

Prisma studio is also avaiable as npm sript

```
npm run studio
```

### Things that need to be done:

- First of all tests
- Finishing up features
- Complete dockerisation

### Things that could be improved

- Middlewares
- Validation ( as part of validation )
- React State Management
- Not using both ServerSideProps and `next /api`
- Documenting the api ( openapi - swagger )
- Handling side-effects in react
- [Separate env files - nextjs and prisma use different default .env files](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
