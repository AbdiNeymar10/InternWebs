package com.example.employee_management.service.impl;

import com.example.employee_management.entity.HrLuTitle;
import com.example.employee_management.repository.HrLuTitleRepository;
import com.example.employee_management.service.HrLuTitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrLuTitleServiceImpl implements HrLuTitleService {

    @Autowired
    private HrLuTitleRepository titleRepository;

    @Override
    public List<HrLuTitle> getAllTitles() {
        return titleRepository.findAll();
    }

    @Override
    public HrLuTitle getTitleById(Long titleId) {
        return titleRepository.findById(titleId)
                .orElseThrow(() -> new RuntimeException("Title not found with id: " + titleId));
    }

    @Override
    public HrLuTitle createTitle(HrLuTitle title) {
        return titleRepository.save(title);
    }

    @Override
    public HrLuTitle updateTitle(Long titleId, HrLuTitle titleDetails) {
        HrLuTitle title = getTitleById(titleId);
        title.setTitle(titleDetails.getTitle());
        return titleRepository.save(title);
    }

    @Override
    public void deleteTitle(Long titleId) {
        HrLuTitle title = getTitleById(titleId);
        titleRepository.delete(title);
    }
}