# Website Template

> Create a website with Svelte/Sapper, TypeScript, Docker, MongoDB and Nginx.

### Get started

Create a new project based on this template using degit:

```sh
npx degit CitRUSprod/website-template my-website
cd my-website
```

The launch is done through docker-compose, but via scripts `scripts/dev` and `scripts/prod`:

```sh
scripts/dev [docker-compose command]
scripts/prod [docker-compose command]
```

Run the project just enter these commands and open http://localhost:6700 in your browser:

```sh
# Development
scripts/dev up -d
yarn && yarn lerna:install
yarn lerna:run dev

# Production
scripts/prod up -d
```

Make a commit via commitizen:

```sh
yarn git:commit
```

### Development mode commands example

```sh
scripts/dev up -d # Start
scripts/dev down # Stop
scripts/dev logs [service] # View service logs
scripts/dev exec [service] sh # Enter the service container
scripts/dev [docker-compose command] # Any docker-compose command
```

### Production mode commands example

```sh
scripts/prod up -d # Start
scripts/prod down # Stop
scripts/prod logs [service] # View service logs
scripts/prod exec [service] sh # Enter the service container
scripts/prod [docker-compose command] # Any docker-compose command
```

### Settings

All settings for docker-compose are written to a `.env` file. If it doesn't exist just enter these command:

```sh
scripts/copy-env
```
