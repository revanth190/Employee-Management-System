package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectResponse {
    private Long projectId;
    private String projectName;
    private String description;
    private Long managerId;
    private String managerName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private int taskCount;
    private LocalDateTime createdAt;
}
