package com.emsa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LeaveRequestDto {
    @NotBlank(message = "Request type is required")
    private String requestType;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
