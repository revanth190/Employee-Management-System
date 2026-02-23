package com.emsa.controller;

import com.emsa.dto.request.KpiRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.KpiResponse;
import com.emsa.service.KpiService;
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
@RequestMapping("/api/kpis")
@Tag(name = "KPI Management", description = "Key Performance Indicators management")
public class KpiController {

    @Autowired
    private KpiService kpiService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create KPI [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<KpiResponse>> create(@Valid @RequestBody KpiRequest request,
                                                            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("KPI created", kpiService.createKpi(auth.getName(), request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Get all KPIs [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<List<KpiResponse>>> getAll(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("KPIs retrieved", kpiService.getMyKpis(auth.getName())));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my KPIs [EMPLOYEE, USER]")
    public ResponseEntity<ApiResponse<List<KpiResponse>>> getMyKpis(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("My KPIs retrieved", kpiService.getMyKpis(auth.getName())));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get KPIs by employee [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<List<KpiResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("KPIs retrieved", kpiService.getKpisByEmployee(employeeId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get KPI by ID")
    public ResponseEntity<ApiResponse<KpiResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("KPI retrieved", kpiService.getKpiById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @Operation(summary = "Update KPI [ADMIN, MANAGER, EMPLOYEE - employee can update achieved value]")
    public ResponseEntity<ApiResponse<KpiResponse>> update(@PathVariable Long id,
                                                            @RequestBody KpiRequest request,
                                                            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("KPI updated", kpiService.updateKpi(id, request, auth.getName())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Delete KPI [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        kpiService.deleteKpi(id);
        return ResponseEntity.ok(ApiResponse.success("KPI deleted", null));
    }
}
