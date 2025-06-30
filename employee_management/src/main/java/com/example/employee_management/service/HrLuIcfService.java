package com.example.employee_management.service;
import com.example.employee_management.entity.HrLuIcf;
import com.example.employee_management.repository.HrLuIcfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HrLuIcfService {

    private final HrLuIcfRepository icfRepository;

    @Autowired
    public HrLuIcfService(HrLuIcfRepository icfRepository) {
        this.icfRepository = icfRepository;
    }

    public List<HrLuIcf> getAllIcfs() {
        return icfRepository.findAll();
    }

    public Optional<HrLuIcf> getIcfById(Long id) {
        return icfRepository.findById(id);
    }

    public HrLuIcf createIcf(HrLuIcf icf) {
        return icfRepository.save(icf);
    }

    public HrLuIcf updateIcf(Long id, HrLuIcf icfDetails) {
        return icfRepository.findById(id)
                .map(icf -> {
                    icf.setIcf(icfDetails.getIcf());
                    icf.setDescription(icfDetails.getDescription());
                    return icfRepository.save(icf);
                })
                .orElseGet(() -> {
                    icfDetails.setId(id);
                    return icfRepository.save(icfDetails);
                });
    }

    public void deleteIcf(Long id) {
        icfRepository.deleteById(id);
    }
}
