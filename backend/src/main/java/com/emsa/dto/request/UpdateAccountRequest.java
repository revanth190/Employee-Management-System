package com.emsa.dto.request;

import com.emsa.entity.RoleName;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateAccountRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private LocalDate hireDate;
    private String designation;
    private Long departmentId;
    private Long reportingManagerId;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private Boolean isActive;
    private RoleName role;
}
