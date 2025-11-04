package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService svc;

    @Autowired
    public StudentController(StudentService svc) {
        this.svc = svc;
    }

    // ✅ Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAll() {
        return ResponseEntity.ok(svc.listAll());
    }

    // ✅ Get one student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable int id) {
        return svc.getById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Student not found"));
    }

    // ✅ Create new student
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Student student) {
        return svc.create(student)
                .<ResponseEntity<?>>map(s -> {
                URI location = URI.create("/api/students/" + s.getId());
                return ResponseEntity.created(location).body(s);
            })
                .orElseGet(() -> ResponseEntity.status(400).body("Maximum entries (" + StudentService.MAX_ENTRIES + ") reached"));
    }

    // ✅ Update existing student
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Student student) {
        return svc.update(id, student)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Student not found"));
    }

    // ✅ Delete a student
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return svc.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(404).body("Student not found");
    }

    // ✅ Clear all
    @DeleteMapping
    public ResponseEntity<String> clearAll() {
        svc.clearAll();
        return ResponseEntity.ok("All students deleted successfully.");
    }
}
