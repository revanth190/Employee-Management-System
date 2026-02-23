package com.emsa.service;

import com.emsa.dto.request.PerformanceReviewRequest;
import com.emsa.dto.response.PerformanceReviewResponse;
import java.util.List;

public interface PerformanceReviewService {
    PerformanceReviewResponse createReview(PerformanceReviewRequest request, String reviewerUsername);
    PerformanceReviewResponse getReviewById(Long id);
    List<PerformanceReviewResponse> getMyReviews(String username);
    List<PerformanceReviewResponse> getReviewsByEmployee(Long employeeId);
    List<PerformanceReviewResponse> getAllReviews();
    PerformanceReviewResponse updateReview(Long id, PerformanceReviewRequest request);
    PerformanceReviewResponse submitSelfAppraisal(Long reviewId, String selfAppraisal, String username);
    void deleteReview(Long id);
}
