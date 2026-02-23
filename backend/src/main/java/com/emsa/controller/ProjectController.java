package com.emsa.controller;

import com.emsa.dto.request.ProjectRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.ProjectResponse;
import com.emsa.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "Project resource management")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create project [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<ProjectResponse>> create(@Valid @RequestBody ProjectRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created", projectService.createProject(request, auth.getName())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all projects [ADMIN only]")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved", projectService.getAllProjects()));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get my managed projects [MANAGER, ADMIN]")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMine(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved", projectService.getMyProjects(auth.getName())));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'ADMIN')")
    @Operation(summary = "Get my assigned projects [EMPLOYEE, MANAGER, ADMIN]", description = "Get projects where I have tasks assigned")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAssigned(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Projects retrieved", projectService.getAssignedProjects(auth.getName())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Project retrieved", projectService.getProjectById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update project [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<ProjectResponse>> update(@PathVariable Long id, @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Project updated", projectService.updateProject(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted", null));
    }
}
