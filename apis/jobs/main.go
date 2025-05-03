package main

import (
	"fmt"

	"github.com/cuthbeorht/job-hunter/http"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)



func main() {
	fmt.Println("Job Junter Rest API")

	router := gin.Default()
	router.Use(cors.New(
		cors.Config{
			AllowOrigins:     []string{"*"},
			AllowMethods:     []string{"*"},
			AllowHeaders:     []string{"Origin"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		},
	))
	router.GET("/jobs", http.GetAll)

	router.Run("localhost:9090")
}

