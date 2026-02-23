package com.emsa.controller;

import com.emsa.dto.request.DepartmentRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.DepartmentResponse;
import com.emsa.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@Tag(name = "Department Management", description = "Department CRUD - Admin only for create/update/delete")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create department [ADMIN only]")
    public ResponseEntity<ApiResponse<DepartmentResponse>> create(@Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created", departmentService.createDepartment(request)));
    }

    @GetMapping
    @Operation(summary = "Get all departments [All roles]", description = "Returns departments sorted with user/employee/manager counts")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved", departmentService.getAllDepartments()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID [All roles]")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Department retrieved", departmentService.getDepartmentById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update department [ADMIN only]")
    public ResponseEntity<ApiResponse<DepartmentResponse>> update(@PathVariable Long id,
                                                                   @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Department updated", departmentService.updateDepartment(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete department [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted", null));
    }
}
