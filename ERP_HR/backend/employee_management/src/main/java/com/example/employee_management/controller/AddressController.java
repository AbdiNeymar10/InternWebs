package com.example.employee_management.controller;

import com.example.employee_management.dto.AddressDTO;
import com.example.employee_management.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees/{employeeId}/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AddressController {
    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<?> getAddressesWithRegionDetails(
            @PathVariable String employeeId) {
        try {
            List<AddressDTO> addresses = addressService.getAddressesDetails(employeeId);
            return ResponseEntity.ok(addresses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "timestamp", System.currentTimeMillis(),
                            "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "error", "Internal Server Error",
                            "message", e.getMessage(),
                            "path", "/api/employees/" + employeeId + "/addresses"
                    ));
        }
    }

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(
            @PathVariable String employeeId,
            @RequestBody AddressDTO addressDTO) {
        try {
            addressDTO.setEmployeeId(employeeId);
            AddressDTO createdAddress = addressService.createAddress(addressDTO);
            return ResponseEntity.ok(createdAddress);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable String employeeId,
            @PathVariable Long id,
            @RequestBody AddressDTO addressDTO) {
        try {
            addressDTO.setEmployeeId(employeeId);
            AddressDTO updatedAddress = addressService.updateAddress(id, addressDTO);
            return ResponseEntity.ok(updatedAddress);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable String employeeId,
            @PathVariable Long id) {
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}