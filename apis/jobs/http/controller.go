package http

import "github.com/cuthbeorht/job-hunter/database"

type JobController struct {
	Connection database.Database
}