package http

import (
	"context"
	"log"

	"github.com/cuthbeorht/job-hunter/models"
	"github.com/gin-gonic/gin"
)

func (controller *JobController) createJob(c *gin.Context) {
	var newJob models.JobEntity

	if err := c.BindJSON(&newJob); err != nil {
		log.Fatalf("Unable to parse request body: %s", err)
	}


	query := "INSERT INTO jobs (title, company, source) VALUES (?, ?, ?)"
	tx, err := controller.Connection.Connection.Begin()
	if err != nil {
		log.Fatalf("Unable to create transaction: %s", err)
	}
	
	result, err := tx.ExecContext(context.Background(), query, newJob.Title, newJob.Company, newJob.Source)
	if err != nil {
		
	}
	tx.Commit()

}
