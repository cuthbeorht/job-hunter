package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Database struct {
	Connection *sql.DB
}

func Connect() Database {
	db, err := sql.Open("postgres","user=root password=toor dbname=job_hunter sslmode=disable")

	if err != nil {
		errMsg := "Failed to connect to database: "+err.Error()
		panic(errMsg)
	}
	db.Close()

	return Database{Connection: db}
}