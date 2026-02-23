package com.emsa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class KpiRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String targetValue;
    private String achievedValue;
    private String status;
    private LocalDateTime dueDate;
}
