package com.emsa.controller;

import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.AuditLogResponse;
import com.emsa.service.impl.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@Tag(name = "Audit & Security", description = "System audit logs - Admin only")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all audit logs [ADMIN only]")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", auditLogService.getAllLogs()));
    }

    @GetMapping("/account/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get audit logs by account [ADMIN only]")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getByAccount(@PathVariable Long accountId) {
        return ResponseEntity.ok(ApiResponse.success("Logs retrieved", auditLogService.getLogsByAccount(accountId)));
    }
}
