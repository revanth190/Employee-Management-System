package com.emsa.service.impl;

import com.emsa.dto.request.PerformanceReviewRequest;
import com.emsa.dto.response.PerformanceReviewResponse;
import com.emsa.entity.Account;
import com.emsa.entity.PerformanceReview;
import com.emsa.exception.BadRequestException;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.PerformanceReviewRepository;
import com.emsa.service.PerformanceReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PerformanceReviewServiceImpl implements PerformanceReviewService {

    @Autowired private PerformanceReviewRepository reviewRepository;
    @Autowired private AccountRepository accountRepository;

    @Override
    public PerformanceReviewResponse createReview(PerformanceReviewRequest request, String reviewerUsername) {
        Account reviewer = accountRepository.findByUsername(reviewerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + reviewerUsername));
        Account employee = accountRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", request.getEmployeeId()));

        PerformanceReview review = PerformanceReview.builder()
                .employee(employee)
                .reviewer(reviewer)
                .cycleName(request.getCycleName())
                .selfAppraisal(request.getSelfAppraisal())
                .managerFeedback(request.getManagerFeedback())
                .rating(request.getRating())
                .status(request.getStatus() != null ? request.getStatus() : "DRAFT")
                .incrementRecommended(request.getIncrementRecommended())
                .build();
        return toResponse(reviewRepository.save(review));
    }

    @Override
    public PerformanceReviewResponse getReviewById(Long id) {
        return toResponse(reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance Review", id)));
    }

    @Override
    public List<PerformanceReviewResponse> getMyReviews(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        return reviewRepository.findByEmployeeAccountId(account.getAccountId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<PerformanceReviewResponse> getReviewsByEmployee(Long employeeId) {
        return reviewRepository.findByEmployeeAccountId(employeeId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<PerformanceReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public PerformanceReviewResponse updateReview(Long id, PerformanceReviewRequest request) {
        PerformanceReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance Review", id));
        if (request.getCycleName() != null) review.setCycleName(request.getCycleName());
        if (request.getManagerFeedback() != null) review.setManagerFeedback(request.getManagerFeedback());
        if (request.getRating() != null) review.setRating(request.getRating());
        if (request.getStatus() != null) review.setStatus(request.getStatus());
        if (request.getIncrementRecommended() != null) review.setIncrementRecommended(request.getIncrementRecommended());
        return toResponse(reviewRepository.save(review));
    }

    @Override
    public PerformanceReviewResponse submitSelfAppraisal(Long reviewId, String selfAppraisal, String username) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Performance Review", reviewId));
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        if (!review.getEmployee().getAccountId().equals(account.getAccountId())) {
            throw new BadRequestException("You can only submit self-appraisal for your own review");
        }
        review.setSelfAppraisal(selfAppraisal);
        review.setStatus("SUBMITTED");
        return toResponse(reviewRepository.save(review));
    }

    @Override
    public void deleteReview(Long id) {
        PerformanceReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Performance Review", id));
        reviewRepository.delete(review);
    }

    private PerformanceReviewResponse toResponse(PerformanceReview r) {
        return PerformanceReviewResponse.builder()
                .reviewId(r.getReviewId())
                .employeeId(r.getEmployee().getAccountId())
                .employeeName(r.getEmployee().getFirstName() + " " + r.getEmployee().getLastName())
                .reviewerId(r.getReviewer().getAccountId())
                .reviewerName(r.getReviewer().getFirstName() + " " + r.getReviewer().getLastName())
                .cycleName(r.getCycleName())
                .selfAppraisal(r.getSelfAppraisal())
                .managerFeedback(r.getManagerFeedback())
                .rating(r.getRating())
                .status(r.getStatus())
                .incrementRecommended(r.getIncrementRecommended())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
