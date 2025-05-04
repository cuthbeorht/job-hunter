package http

import (
	"net/http"

	"github.com/cuthbeorht/job-hunter/database"
	"github.com/cuthbeorht/job-hunter/models"
	"github.com/gin-gonic/gin"
)

var jobs = []models.Job {{Id: "1", Title: "Developer"}, {Id: "2", Title: "Cashier"}}

type JobController struct {
	Connection database.Database
}

func (controller *JobController) GetAll(c *gin.Context) {

	c.IndentedJSON(http.StatusOK, jobs)
}