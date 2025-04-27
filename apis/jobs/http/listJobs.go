package http

import (
	"net/http"

	"github.com/cuthbeorht/job-hunter/models"
	"github.com/gin-gonic/gin"
)

var jobs = []models.Job {{Id: "1", Title: "Developer"}, {Id: "2", Title: "Cashier"}}

func GetAll(c *gin.Context) {

	c.IndentedJSON(http.StatusOK, jobs)
}