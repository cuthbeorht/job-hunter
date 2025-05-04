package database

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Database struct {
	Connection *gorm.DB
}

func Connect() Database {
	db, err := gorm.Open("postgres","user=root password=toor dbname=job_hunter sslmode=disable")

	if err != nil {
		errMsg := "Failed to connect to database: "+err.Error()
		panic(errMsg)
	}
	db.Close()

	return Database{Connection: db}
}