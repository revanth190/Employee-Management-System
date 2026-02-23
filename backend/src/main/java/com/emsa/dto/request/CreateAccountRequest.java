package com.emsa.dto.request;

import com.emsa.entity.RoleName;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateAccountRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private RoleName role;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
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
}
