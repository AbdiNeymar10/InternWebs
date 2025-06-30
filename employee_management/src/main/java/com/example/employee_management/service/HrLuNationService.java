package com.example.employee_management.service;

import com.example.employee_management.entity.HrLuNation;
import java.util.List;

public interface HrLuNationService {
    List<HrLuNation> getAllNations();
    HrLuNation getNationById(Integer nationCode);
    HrLuNation createNation(HrLuNation nation);
    HrLuNation updateNation(Integer nationCode, HrLuNation nationDetails);
    void deleteNation(Integer nationCode);
}
