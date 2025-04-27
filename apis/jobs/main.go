package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Job struct {
	Id string `json:"id"`
}

func main() {
	fmt.Println("Job Junter Rest API")

	router := gin.Default()
	router.GET("/jobs", getJobs)

	router.Run("localhost:9090")
}

func getJobs(c *gin.Context) {

	jobs := []Job{}

	c.IndentedJSON(http.StatusOK, jobs)
}