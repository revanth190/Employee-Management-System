package com.emsa.dto.response;

import com.emsa.entity.RoleName;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AccountResponse {
    private Long accountId;
    private String username;
    private String email;
    private RoleName role;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private LocalDate hireDate;
    private String designation;
    private Long departmentId;
    private String departmentName;
    private Long reportingManagerId;
    private String reportingManagerName;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
