# User Networking

## Description

This project aims to migrate JSON data into a relational database with Sequelize ORM, using Fastify for the backend. The formatted data is then used to generate a networking chart on the frontend using Next.js, Tailwind CSS, and the Nivo chart library. The primary purpose is to visualize relationships between users and allow users to add new connections.

## Features

- **JSON to Relational Database Migration:** Migrate JSON data representing user relationships into a PostgreSQL database with the PostGIS extension for efficient spatial querying.

- **User Management:** Add, update, and delete users in the database, including their connections (friends).

- **Networking Chart:** Visualize user relationships using the Nivo chart library in a Next.js frontend with Tailwind CSS styling.

## Technologies Used

- **Backend:**

  - Node.js
  - Fastify
  - Sequelize (or your preferred ORM/ODM)
  - PostgreSQL with PostGIS extension

- **Frontend:**

  - Next.js
  - Tailwind CSS
  - Nivo chart library

## Demo

- **demo.mp4**

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nullgrim/user-networking.git

   ```

2. **Install backend dependecies**

   ```bash
   cd backend
   yarn
   ```

3. **Install frontend dependecies**

   ```bash
   cd frontend
   yarn
   ```

4. **Setup database**

   ```bash
   Create a database called "users"
   Config the database /backend/example.env or /backend/database/config.js
   ```

5. **Migrate data**

   ```bash
   cd backend
   yarn db:refresh
   ```

6. **Start API**

   ```bash
   cd backend
   yarn dev
   ```

7. **Build & Start frontend**

   ```bash
    cd frontend
    yarn build
    yarn start
   ```
