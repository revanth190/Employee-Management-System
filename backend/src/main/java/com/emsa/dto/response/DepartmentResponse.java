package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DepartmentResponse {
    private Long departmentId;
    private String departmentName;
    private String description;
    private long userCount;
    private long employeeCount;
    private long managerCount;
    private LocalDateTime createdAt;
}
