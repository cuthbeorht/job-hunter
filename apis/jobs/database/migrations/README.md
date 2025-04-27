# Database Migrations

## Environment

To migrate a database, first, the correct environment variable must be set containing the database connection string.

```bash
export POSTGRESQL_URL='postgres://root:toor@localhost:5432/job_hunter?sslmode=disable'
```

## Installation

```bash
export version=v4.18.3
export os=linux
export arch=amd64

curl -L https://github.com/golang-migrate/migrate/releases/download/$version/migrate.$os-$arch.tar.gz | tar xvz

mv migrate ~/.local/bin
```

## Migrations
### Create a migration

First, create a migration:

```bash
migrate create -ext sql -dir apis/jobs/database/migrations -seq create_jobs_table
```

### Run Migrations

To run the migrations forward:

```bash
migrate -database ${POSTGRESQL_URL} -path apis/jobs/database/migrations up
```

To undo back to the original state:

```bash
migrate -database ${POSTGRESQL_URL} -path apis/jobs/database/migrations down
```

### Problems

#### I have the error "error: Dirty database version 1. Fix and force version."

This is cuz a change went bad and needs to be forced:

```bash
migrate -path apis/jobs/database/migrations -database ${POSTGRESQL_URL} force 1
```