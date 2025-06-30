package com.example.employee_management.service;

import com.example.employee_management.entity.OrganizationTitle;
import com.example.employee_management.repository.OrganizationTitleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationTitleService {

    @Autowired
    private OrganizationTitleRepository organizationTitleRepository;

    public List<OrganizationTitle> getAllOrganizationTitles() {
        return organizationTitleRepository.findAll();
    }

    public OrganizationTitle getOrganizationTitleById(Long id) {
        return organizationTitleRepository.findById(id).orElse(null);
    }

    public OrganizationTitle saveOrganizationTitle(OrganizationTitle title) {
        return organizationTitleRepository.save(title);
    }

    public void deleteOrganizationTitle(Long id) {
        organizationTitleRepository.deleteById(id);
    }
}