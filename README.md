# CinemaCTRL

CinemaCTRL is a complete application for managing and viewing details about a cinema.

# Features
- User / Admin views
- CRUD - Movies / Ratings / Showings / Reservations / Theaters
- Authentication system

# Technologies
Frontend: Angular, PrimeNG
Backend: NestJS, TypeORM, bcryptjs
DevOps: Docker + Docker Compose

# Getting started

## Local setup - classic

### Scripts

There are 2 scripts provided:
- A bash script - Installs `node_modules` using `bun` and starts everything in `ptyxis`, does not handle installing the needed tools 
- A powershell script - should autosetup everything - from installing `bun` to installing `winget`, `Windows Terminal`, project dependencies and running everything in tabs.

Seeding the database shall be done manually for both of the scripts by installing `node_modules` and running the `.ts` inside the `seeds` folder.

### Manual

Required steps:

- Install `bun`
- Install a Postgres database
- Install the frontend, backend, seeding project dependencies
- Setup environment variables for the project related to the host for most of the apps and database info
- Run the start scripts for the frontend, backend (each of the apps)

## Local setup - docker

You should be up and running by installing docker and just running `docker compose up --build` in the root of the project.
