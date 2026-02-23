package com.emsa.service;

import com.emsa.dto.request.LeaveRequestDto;
import com.emsa.dto.request.ReviewLeaveRequest;
import com.emsa.dto.response.LeaveRequestResponse;
import java.util.List;

public interface LeaveService {
    LeaveRequestResponse submitRequest(String username, LeaveRequestDto request);
    LeaveRequestResponse getRequestById(Long id);
    List<LeaveRequestResponse> getMyRequests(String username);
    List<LeaveRequestResponse> getAllRequests();
    List<LeaveRequestResponse> getTeamRequests(String managerUsername);
    LeaveRequestResponse reviewRequest(Long id, ReviewLeaveRequest request, String reviewerUsername);
}
