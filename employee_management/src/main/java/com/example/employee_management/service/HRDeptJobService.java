package com.example.employee_management.service;

import com.example.employee_management.entity.HRDeptJob;
import com.example.employee_management.repository.HRDeptJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HRDeptJobService {

    @Autowired
    private HRDeptJobRepository hrDeptJobRepository;

    public List<HRDeptJob> getAllDeptJobs() {
        return hrDeptJobRepository.findAll();
    }

    public Optional<HRDeptJob> getDeptJobById(Long id) {
        return hrDeptJobRepository.findById(id);
    }

    public HRDeptJob saveDeptJob(HRDeptJob hrDeptJob) {
        return hrDeptJobRepository.save(hrDeptJob);
    }

   public List<HRDeptJob> getJobsByDepartmentId(Long departmentId) {
    return hrDeptJobRepository.findByDepartment_DeptId(departmentId);
   }

    public void deleteDeptJob(Long id) {
        hrDeptJobRepository.deleteById(id);
    }
}