package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class KpiResponse {
    private Long kpiId;
    private Long employeeId;
    private String employeeName;
    private Long assignedById;
    private String assignedByName;
    private String title;
    private String description;
    private String targetValue;
    private String achievedValue;
    private String status;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
}
