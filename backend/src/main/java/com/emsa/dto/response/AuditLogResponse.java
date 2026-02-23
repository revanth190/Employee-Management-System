package com.emsa.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditLogResponse {
    private Long logId;
    private Long accountId;
    private String accountUsername;
    private String action;
    private String entityName;
    private Long entityId;
    private String details;
    private String ipAddress;
    private LocalDateTime createdAt;
}
