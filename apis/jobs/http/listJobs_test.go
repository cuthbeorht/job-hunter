package http

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http/httptest"
	"slices"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cuthbeorht/job-hunter/database"
	"github.com/cuthbeorht/job-hunter/models"
	"github.com/gin-gonic/gin"
)

func setup(tb testing.TB) func(tb testing.TB) {
	log.Println("Setting up tests")

	return func(tb testing.TB) {
		log.Println("Tearing down tests")
	}
}

func NewMockDb() (*sql.DB, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()

	if err != nil {
        log.Fatalf("An error '%s' was not expected when opening a stub database connection", err)
    }

    return db, mock
}

func TestGivenNoJobsListJobsExpectNonEmptyList(t *testing.T) {
	td := setup(t)
	defer td(t)

	db, mock := NewMockDb()
	defer db.Close()

	columns := []string{"id", "title", "company", "source"}
	mock.ExpectQuery("SELECT \\* from jobs").WillReturnRows(
		sqlmock.NewRows(columns).AddRow( "1", "Developer", "Squaresoft", "LinkedInd"),
	)

	database := database.Database{Connection: db}
	controller := JobController{Connection: database}

	
	
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	controller.GetAll(c)
	

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Expectations were not met: %s", err)
	}

	if w.Code != 200 {
		t.Error(w.Code, "Epxeciting code 200")
	}
}

func TestGivenJobsListJobsExpect2Jobs(t *testing.T) {
	td := setup(t)
	defer td(t)

	db, mock := NewMockDb()
	defer db.Close()

	columns := []string{"id", "title", "company", "source"}
	mock.ExpectQuery("SELECT \\* from jobs").WillReturnRows(
		sqlmock.NewRows(columns).
			AddRow( "1", "Developer", "Squaresoft", "LinkedInd").
			AddRow( "2", "Cashier", "Maxi", "LinkedInd"),
	)

	database := database.Database{Connection: db}
	controller := JobController{Connection: database}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	controller.GetAll(c)

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

	db, mock := NewMockDb()
	defer db.Close()

	columns := []string{"id", "title", "company", "source"}
	mock.ExpectQuery("SELECT \\* from jobs").WillReturnRows(
		sqlmock.NewRows(columns).
			AddRow( "1", "Developer", "Squaresoft", "LinkedIn").
			AddRow( "2", "Cashier", "Maxi", "LinkedIn"),
	)

	database := database.Database{Connection: db}
	controller := JobController{Connection: database}

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	var jobs = []models.Job {
		{Id: 1, Title: "Developer", Company: "Squaresoft", Source: "LinkedIn"},
		{Id: 2, Title: "Cashier", Company: "Maxi", Source: "LinkedIn"},
	}

	controller.GetAll(c)

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