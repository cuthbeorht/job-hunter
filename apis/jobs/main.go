package main

import (
	"fmt"

	"github.com/cuthbeorht/job-hunter/http"
	"github.com/gin-gonic/gin"
)



func main() {
	fmt.Println("Job Junter Rest API")

	router := gin.Default()
	router.GET("/jobs", http.GetAll)

	router.Run("localhost:9090")
}

