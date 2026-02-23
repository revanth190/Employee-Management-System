package com.emsa.controller;

import com.emsa.dto.request.PerformanceReviewRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.PerformanceReviewResponse;
import com.emsa.service.PerformanceReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/performance-reviews")
@Tag(name = "Performance Reviews", description = "Appraisal cycle and performance management")
public class PerformanceReviewController {

    @Autowired
    private PerformanceReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create review [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> create(@RequestBody PerformanceReviewRequest request,
                                                                          Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review created", reviewService.createReview(request, auth.getName())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all reviews [ADMIN only]")
    public ResponseEntity<ApiResponse<List<PerformanceReviewResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviewService.getAllReviews()));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my reviews [EMPLOYEE, USER]")
    public ResponseEntity<ApiResponse<List<PerformanceReviewResponse>>> getMyReviews(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("My reviews retrieved", reviewService.getMyReviews(auth.getName())));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get reviews by employee [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<List<PerformanceReviewResponse>>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviewService.getReviewsByEmployee(employeeId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review by ID")
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Review retrieved", reviewService.getReviewById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update review [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> update(@PathVariable Long id,
                                                                          @RequestBody PerformanceReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Review updated", reviewService.updateReview(id, request)));
    }

    @PatchMapping("/{id}/self-appraisal")
    @Operation(summary = "Submit self-appraisal [EMPLOYEE]")
    public ResponseEntity<ApiResponse<PerformanceReviewResponse>> selfAppraisal(@PathVariable Long id,
                                                                                  @RequestBody Map<String, String> body,
                                                                                  Authentication auth) {
        String appraisal = body.get("selfAppraisal");
        return ResponseEntity.ok(ApiResponse.success("Self-appraisal submitted",
                reviewService.submitSelfAppraisal(id, appraisal, auth.getName())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete review [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
