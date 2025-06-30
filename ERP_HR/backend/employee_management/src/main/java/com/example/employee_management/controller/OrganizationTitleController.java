package com.example.employee_management.controller;

import com.example.employee_management.entity.OrganizationTitle;
import com.example.employee_management.service.OrganizationTitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/organization-title")
public class OrganizationTitleController {

    @Autowired
    private OrganizationTitleService organizationTitleService;

    @GetMapping
    public List<OrganizationTitle> getAllOrganizationTitles() {
        return organizationTitleService.getAllOrganizationTitles();
    }

    @GetMapping("/{id}")
    public OrganizationTitle getOrganizationTitleById(@PathVariable Long id) {
        return organizationTitleService.getOrganizationTitleById(id);
    }

    @PostMapping
    public OrganizationTitle saveOrganizationTitle(@RequestBody OrganizationTitle title) {
        return organizationTitleService.saveOrganizationTitle(title);
    }

    @DeleteMapping("/{id}")
    public void deleteOrganizationTitle(@PathVariable Long id) {
        organizationTitleService.deleteOrganizationTitle(id);
    }
}