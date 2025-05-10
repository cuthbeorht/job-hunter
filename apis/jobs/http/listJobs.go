package http

import (
	"log"
	"net/http"

	"github.com/cuthbeorht/job-hunter/database"
	"github.com/cuthbeorht/job-hunter/models"
	"github.com/gin-gonic/gin"
)

// var jobs = []models.Job {{Id: "1", Title: "Developer"}, {Id: "2", Title: "Cashier"}}

type JobController struct {
	Connection database.Database
}

func (controller *JobController) GetAll(c *gin.Context) {
	var jobs []models.JobEntity

	rows, err := controller.Connection.Connection.Query("SELECT * from jobs")
	if err != nil {
		log.Fatalf("Error preparing query fetching jobs: %s", err)
	}
	defer rows.Close()

	for rows.Next() {
		var job models.JobEntity

		if err := rows.Scan(&job.Id, &job.Title, &job.Company, &job.Source); err != nil {
			log.Fatalf("Error fetchihnhg a job: %s", err)
		}

		jobs = append(jobs, job)
	}

	c.IndentedJSON(http.StatusOK, jobs)
}