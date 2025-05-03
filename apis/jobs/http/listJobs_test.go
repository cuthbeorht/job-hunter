package http

import (
	"encoding/json"
	"log"
	"net/http/httptest"
	"slices"
	"testing"

	"github.com/cuthbeorht/job-hunter/models"
	"github.com/gin-gonic/gin"
)

func setup(tb testing.TB) func(tb testing.TB) {
	log.Println("Setting up tests")

	return func(tb testing.TB) {
		log.Println("Tearing down tests")
	}
}

func TestGivenNoJobsListJobsExpectNonEmptyList(t *testing.T) {
	td := setup(t)
	defer td(t)

	
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	GetAll(c)

	if w.Code != 200 {
		t.Error(w.Code, "Epxeciting code 200")
	}
}

func TestGivenJobsListJobsExpect2Jobs(t *testing.T) {
	td := setup(t)
	defer td(t)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	GetAll(c)

	var actualJobs []models.Job

	err := json.Unmarshal([]byte(w.Body.Bytes()), &actualJobs)
	if err != nil {
		t.Error("Error parsing error: ", err)
	}

	if len(actualJobs) != 2 {
		t.Error("Expected 2 jobs. Got ", len(actualJobs))
	}
}

func TestGivenJobsListJobsExpectDeveloperAndCashierJobs(t *testing.T) {
	td := setup(t)
	defer td(t)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	var jobs = []models.Job {{Id: "1", Title: "Developer"}, {Id: "2", Title: "Cashier"}}

	GetAll(c)

	var actualJobs []models.Job

	err := json.Unmarshal([]byte(w.Body.Bytes()), &actualJobs)
	if err != nil {
		t.Error("Error parsing error: ", err)
	}

	for _, actualJob := range actualJobs {
		isPresent := slices.Contains(jobs, actualJob)
		if !isPresent {
			t.Error("Missing object ", actualJob)
		}
	}
}