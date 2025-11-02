package com.example.demo.model;

import java.util.List;

public class Student {
    private Integer id;
    private String name;
    private String registrationNumber;
    private List<String> courses;
    private String projectGroup;

    public Student() {}

    public Student(Integer id, String name, String registrationNumber, List<String> courses, String projectGroup) {
        this.id = id;
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.courses = courses;
        this.projectGroup = projectGroup;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // getters & setters for other fields

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public List<String> getCourses() { return courses; }
    public void setCourses(List<String> courses) { this.courses = courses; }

    public String getProjectGroup() { return projectGroup; }
    public void setProjectGroup(String projectGroup) { this.projectGroup = projectGroup; }
}
