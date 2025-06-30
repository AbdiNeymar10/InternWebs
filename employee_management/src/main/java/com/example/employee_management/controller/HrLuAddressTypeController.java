package com.example.employee_management.controller;

import com.example.employee_management.dto.HrLuAddressTypeDTO;
import com.example.employee_management.service.HrLuAddressTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hr-lu-address-type")
@RequiredArgsConstructor
public class HrLuAddressTypeController {
    private final HrLuAddressTypeService hrLuAddressTypeService;

    @GetMapping
    public ResponseEntity<List<HrLuAddressTypeDTO>> getAllAddressTypes() {
        List<HrLuAddressTypeDTO> addressTypes = hrLuAddressTypeService.getAllAddressTypes();

        if (addressTypes.isEmpty() || addressTypes.get(0).getId() == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(addressTypes);
    }
}