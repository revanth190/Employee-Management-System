package com.emsa.controller;

import com.emsa.dto.request.TaskRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.TaskResponse;
import com.emsa.service.TaskService;
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
@RequestMapping("/api/tasks")
@Tag(name = "Task Management", description = "Task assignment and tracking")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create task [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<TaskResponse>> create(@Valid @RequestBody TaskRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created", taskService.createTask(request, auth.getName())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all tasks [ADMIN only]")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("All tasks retrieved", taskService.getAllTasks()));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my tasks [All roles]")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getMyTasks(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("My tasks retrieved", taskService.getMyTasks(auth.getName())));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get tasks by project")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved", taskService.getTasksByProject(projectId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Task retrieved", taskService.getTaskById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task [ADMIN, MANAGER - full update; EMPLOYEE - status/hours only]")
    public ResponseEntity<ApiResponse<TaskResponse>> update(@PathVariable Long id,
                                                             @RequestBody TaskRequest request,
                                                             Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Task updated", taskService.updateTask(id, request, auth.getName())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Delete task [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }
}
