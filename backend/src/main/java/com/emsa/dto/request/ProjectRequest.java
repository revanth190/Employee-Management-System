package com.emsa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjectRequest {
    @NotBlank(message = "Project name is required")
    private String projectName;
    private String description;
    private Long managerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
