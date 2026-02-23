package com.emsa.controller;

import com.emsa.dto.request.LeaveRequestDto;
import com.emsa.dto.request.ReviewLeaveRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.LeaveRequestResponse;
import com.emsa.service.LeaveService;
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
@RequestMapping("/api/leave-requests")
@Tag(name = "Leave & HR Requests", description = "Leave, WFH, HR requests management")
public class LeaveRequestController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping
    @Operation(summary = "Submit request [All roles]", description = "Types: LEAVE, WFH, REIMBURSEMENT, HR_REQUEST")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> submit(@Valid @RequestBody LeaveRequestDto request,
                                                                     Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Request submitted", leaveService.submitRequest(auth.getName(), request)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my requests [All roles]")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getMyRequests(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Requests retrieved", leaveService.getMyRequests(auth.getName())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all requests [ADMIN only]")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("All requests retrieved", leaveService.getAllRequests()));
    }

    @GetMapping("/team")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get team requests [MANAGER, ADMIN]")
    public ResponseEntity<ApiResponse<List<LeaveRequestResponse>>> getTeamRequests(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Team requests retrieved", leaveService.getTeamRequests(auth.getName())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request by ID")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Request retrieved", leaveService.getRequestById(id)));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Review request [ADMIN, MANAGER]", description = "status: APPROVED or REJECTED")
    public ResponseEntity<ApiResponse<LeaveRequestResponse>> review(@PathVariable Long id,
                                                                     @Valid @RequestBody ReviewLeaveRequest request,
                                                                     Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Request reviewed", leaveService.reviewRequest(id, request, auth.getName())));
    }
}
