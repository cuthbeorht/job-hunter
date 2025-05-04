package models

import "github.com/jinzhu/gorm"

type Job struct {
	Id string `json:"id"`
	Title string `json:"title"`
	Company string `json:"company"`
	Source string `json:"source"`
}

type JobEntity struct {
	gorm.Model
	
	Id string 
	Title string 
	Company string 
	Source string
}