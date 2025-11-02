package com.example.demo.service;

import com.example.demo.model.Student;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class StudentService {
    private final Map<Integer, Student> store = new ConcurrentHashMap<>();
    private final AtomicInteger idCounter = new AtomicInteger(0);
    public static final int MAX_ENTRIES = 100;

    public List<Student> listAll() {
        ArrayList<Student> list = new ArrayList<>(store.values());
        list.sort(Comparator.comparing(Student::getId));
        return list;
    }

    public Optional<Student> getById(int id) {
        return Optional.ofNullable(store.get(id));
    }

    public synchronized Optional<Student> create(Student s) {
        if (store.size() >= MAX_ENTRIES) {
            return Optional.empty();
        }
        int id = idCounter.incrementAndGet();
        s.setId(id);
        store.put(id, s);
        return Optional.of(s);
    }

    public Optional<Student> update(int id, Student s) {
        if (!store.containsKey(id)) return Optional.empty();
        s.setId(id);
        store.put(id, s);
        return Optional.of(s);
    }

    public boolean delete(int id) {
        return store.remove(id) != null;
    }

    public void clearAll() {
        store.clear();
        idCounter.set(0);
    }
}
