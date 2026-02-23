package com.emsa.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long assignedToId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Double hoursLogged;
}
