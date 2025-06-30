package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuTitle;
import java.util.List;

public interface HrLuTitleService {
    List<HrLuTitle> getAllTitles();
    HrLuTitle getTitleById(Long titleId);
    HrLuTitle createTitle(HrLuTitle title);
    HrLuTitle updateTitle(Long titleId, HrLuTitle titleDetails);
    void deleteTitle(Long titleId);
}