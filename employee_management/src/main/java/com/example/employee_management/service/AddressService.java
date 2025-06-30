package com.example.employee_management.service;

import com.example.employee_management.dto.AddressDTO;
import com.example.employee_management.entity.Address;
import com.example.employee_management.entity.HrEmployee;
import com.example.employee_management.exception.ResourceNotFoundException;
import com.example.employee_management.repository.AddressRepository;
import com.example.employee_management.repository.HrEmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;
    private final HrEmployeeRepository hrEmployeeRepository;
    private final ModelMapper modelMapper;
    private static final Logger log = LoggerFactory.getLogger(AddressService.class);

    public List<AddressDTO> getAddressesDetails(String employeeId) {
        try {
            List<Object[]> results = addressRepository.findAddressesWithRegionDetails(employeeId);
            if (results == null || results.isEmpty()) {
                return Collections.emptyList();
            }
            return results.stream()
                    .map(this::mapToAddressDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching addresses for employee {}: {}", employeeId, e.getMessage());
            throw new RuntimeException("Failed to fetch addresses: " + e.getMessage());
        }
    }

    public AddressDTO createAddress(AddressDTO addressDTO) {
        HrEmployee employee = hrEmployeeRepository.findById(addressDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + addressDTO.getEmployeeId()));

        Address address = modelMapper.map(addressDTO, Address.class);
        address.setEmployee(employee);

        Address savedAddress = addressRepository.save(address);
        return convertToDto(savedAddress);
    }

    public AddressDTO updateAddress(Long id, AddressDTO addressDTO) {
        Address existingAddress = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + id));

        modelMapper.map(addressDTO, existingAddress);

        if (addressDTO.getEmployeeId() != null &&
                !addressDTO.getEmployeeId().equals(existingAddress.getEmpId())) {
            HrEmployee employee = hrEmployeeRepository.findById(addressDTO.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + addressDTO.getEmployeeId()));
            existingAddress.setEmployee(employee);
        }

        Address updatedAddress = addressRepository.save(existingAddress);
        return convertToDto(updatedAddress);
    }

    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ResourceNotFoundException("Address not found with id: " + id);
        }
        addressRepository.deleteById(id);
    }

    public List<AddressDTO> getAddressesByEmployeeId(String employeeId) {
        List<Address> addresses = addressRepository.findByEmpId(employeeId);
        return addresses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private AddressDTO convertToDto(Address address) {
        AddressDTO dto = modelMapper.map(address, AddressDTO.class);
        if (address.getRegionDetails() != null) {
            dto.setRegionId(address.getRegionDetails().getId());
            dto.setRegionName(address.getRegionDetails().getRegionName());
            dto.setRegionDescription(address.getRegionDetails().getDescription());
        }
        return dto;
    }

    private AddressDTO mapToAddressDTO(Object[] result) {
        AddressDTO dto = new AddressDTO();

        try {
            // Verify the result array structure
            if (result.length < 17) {
                throw new RuntimeException("Invalid result array length: " + result.length);
            }

            // Safely map basic address fields with null checks
            dto.setId(getLongValue(result[0]));
            dto.setEmployeeId(getStringValue(result[1]));
            dto.setAddressType(getIntegerValue(result[2]));
            dto.setWereda(getStringValue(result[3]));
            dto.setKebele(getStringValue(result[4]));
            dto.setTelephoneOffice(getStringValue(result[5]));
            dto.setEmail(getStringValue(result[6]));
            dto.setPoBox(getStringValue(result[7]));
            dto.setMobileNumber(getStringValue(result[8]));
            dto.setZone(getStringValue(result[9]));
            dto.setKifleketema(getStringValue(result[10]));
            dto.setTeleHome(getStringValue(result[11]));
            dto.setHouseNo(getStringValue(result[12]));
            dto.setRegion(getStringValue(result[13]));

            // Map region details if they exist
            if (result.length > 14) {
                dto.setRegionId(getLongValue(result[14]));
                dto.setRegionName(getStringValue(result[15]));
                dto.setRegionDescription(getStringValue(result[16]));
            }
        } catch (Exception e) {
            log.error("Error mapping address data. Result array: {}", Arrays.toString(result), e);
            throw new RuntimeException("Failed to map address data: " + e.getMessage());
        }

        return dto;
    }

    // Helper methods for safe type conversion
    private Long getLongValue(Object value) {
        if (value == null) return null;
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            log.warn("Failed to parse Long value: {}", value);
            return null;
        }
    }

    private Integer getIntegerValue(Object value) {
        if (value == null) return null;
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            log.warn("Failed to parse Integer value: {}", value);
            return null;
        }
    }

    private String getStringValue(Object value) {
        return value != null ? value.toString() : null;
    }
}