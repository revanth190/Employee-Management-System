package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskResponse {
    private Long taskId;
    private Long projectId;
    private String projectName;
    private Long assignedToId;
    private String assignedToName;
    private Long assignedById;
    private String assignedByName;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Double hoursLogged;
    private LocalDateTime createdAt;
}
