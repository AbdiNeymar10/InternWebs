package com.example.employee_management.controller;
import com.example.employee_management.entity.HrLuNationality;
import com.example.employee_management.service.HrLuNationalityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/nationalities")
public class HrLuNationalityController {

    @Autowired
    private HrLuNationalityService service;

    @GetMapping
    public List<HrLuNationality> getAllNationalities() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HrLuNationality> getNationalityById(@PathVariable Long id) {
        Optional<HrLuNationality> nationality = service.findById(id);
        return nationality.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public HrLuNationality createNationality(@RequestBody HrLuNationality nationality) {
        return service.save(nationality);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HrLuNationality> updateNationality(
            @PathVariable Long id, @RequestBody HrLuNationality nationality) {
        return ResponseEntity.ok(service.update(id, nationality));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNationality(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
