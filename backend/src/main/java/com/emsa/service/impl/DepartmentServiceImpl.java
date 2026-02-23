package com.emsa.service.impl;

import com.emsa.dto.request.DepartmentRequest;
import com.emsa.dto.response.DepartmentResponse;
import com.emsa.entity.Department;
import com.emsa.entity.RoleName;
import com.emsa.exception.BadRequestException;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.DepartmentRepository;
import com.emsa.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new BadRequestException("Department already exists: " + request.getDepartmentName());
        }
        Department dept = Department.builder()
                .departmentName(request.getDepartmentName())
                .description(request.getDescription())
                .build();
        return toResponse(departmentRepository.save(dept));
    }

    @Override
    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        return toResponse(dept);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        dept.setDepartmentName(request.getDepartmentName());
        dept.setDescription(request.getDescription());
        return toResponse(departmentRepository.save(dept));
    }

    @Override
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        departmentRepository.delete(dept);
    }

    private DepartmentResponse toResponse(Department dept) {
        List<com.emsa.entity.Account> accounts = accountRepository.findByDepartmentDepartmentId(dept.getDepartmentId());
        long userCount = accounts.stream().filter(a -> a.getRole() == RoleName.USER).count();
        long empCount = accounts.stream().filter(a -> a.getRole() == RoleName.EMPLOYEE).count();
        long mgrCount = accounts.stream().filter(a -> a.getRole() == RoleName.MANAGER).count();

        return DepartmentResponse.builder()
                .departmentId(dept.getDepartmentId())
                .departmentName(dept.getDepartmentName())
                .description(dept.getDescription())
                .userCount(userCount)
                .employeeCount(empCount)
                .managerCount(mgrCount)
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
