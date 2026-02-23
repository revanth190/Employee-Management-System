package com.emsa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank(message = "Department name is required")
    private String departmentName;
    private String description;
}
