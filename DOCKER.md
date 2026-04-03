# Docker Setup

This document provides instructions for building and running the application using Docker.

## Prerequisites

- Docker installed on your system
- `.env.local` file with required environment variables

## Building the Docker Image

To build the Docker image, run the following command from the project root:

```bash
docker build -t bblunt .
```

## Running the Container

To run the container with environment variables from `.env.local`:

```bash
docker run -p 3000:3000 --env-file .env.local bblunt
```

The application will be available at `http://localhost:3000`.

## Notes

- The Docker build automatically sets `DOCKER_BUILD=true` environment variable, which enables the `output: "standalone"` configuration in `next.config.js`
- This standalone output is required for Docker deployments but not needed for production blue-green deployments using `bun run start`
- Make sure your `.env.local` file contains all necessary environment variables for the application to run properly
