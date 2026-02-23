package com.emsa.service.impl;

import com.emsa.dto.request.LeaveRequestDto;
import com.emsa.dto.request.ReviewLeaveRequest;
import com.emsa.dto.response.LeaveRequestResponse;
import com.emsa.entity.Account;
import com.emsa.entity.LeaveRequest;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.LeaveRequestRepository;
import com.emsa.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LeaveServiceImpl implements LeaveService {

    @Autowired private LeaveRequestRepository leaveRequestRepository;
    @Autowired private AccountRepository accountRepository;

    @Override
    public LeaveRequestResponse submitRequest(String username, LeaveRequestDto request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        LeaveRequest lr = LeaveRequest.builder()
                .account(account)
                .requestType(request.getRequestType())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status("PENDING")
                .build();
        return toResponse(leaveRequestRepository.save(lr));
    }

    @Override
    public LeaveRequestResponse getRequestById(Long id) {
        return toResponse(leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Request", id)));
    }

    @Override
    public List<LeaveRequestResponse> getMyRequests(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        return leaveRequestRepository.findByAccountAccountId(account.getAccountId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestResponse> getAllRequests() {
        return leaveRequestRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestResponse> getTeamRequests(String managerUsername) {
        Account manager = accountRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + managerUsername));
        return leaveRequestRepository.findByAccountReportingManagerAccountId(manager.getAccountId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public LeaveRequestResponse reviewRequest(Long id, ReviewLeaveRequest request, String reviewerUsername) {
        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Request", id));
        Account reviewer = accountRepository.findByUsername(reviewerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + reviewerUsername));
        lr.setStatus(request.getStatus());
        lr.setReviewedBy(reviewer);
        lr.setReviewComment(request.getReviewComment());
        return toResponse(leaveRequestRepository.save(lr));
    }

    private LeaveRequestResponse toResponse(LeaveRequest lr) {
        return LeaveRequestResponse.builder()
                .requestId(lr.getRequestId())
                .accountId(lr.getAccount().getAccountId())
                .accountName(lr.getAccount().getFirstName() + " " + lr.getAccount().getLastName())
                .requestType(lr.getRequestType())
                .description(lr.getDescription())
                .startDate(lr.getStartDate())
                .endDate(lr.getEndDate())
                .status(lr.getStatus())
                .reviewedById(lr.getReviewedBy() != null ? lr.getReviewedBy().getAccountId() : null)
                .reviewedByName(lr.getReviewedBy() != null ? lr.getReviewedBy().getFirstName() + " " + lr.getReviewedBy().getLastName() : null)
                .reviewComment(lr.getReviewComment())
                .createdAt(lr.getCreatedAt())
                .build();
    }
}
