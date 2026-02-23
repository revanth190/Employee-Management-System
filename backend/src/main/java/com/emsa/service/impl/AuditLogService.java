package com.emsa.service.impl;

import com.emsa.dto.response.AuditLogResponse;
import com.emsa.entity.Account;
import com.emsa.entity.AuditLog;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuditLogService {

    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private AccountRepository accountRepository;

    public void log(String username, String action, String entityName, Long entityId, String details) {
        Account account = accountRepository.findByUsername(username).orElse(null);
        AuditLog log = AuditLog.builder()
                .account(account)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLogResponse> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<AuditLogResponse> getLogsByAccount(Long accountId) {
        return auditLogRepository.findByAccountAccountIdOrderByCreatedAtDesc(accountId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .logId(log.getLogId())
                .accountId(log.getAccount() != null ? log.getAccount().getAccountId() : null)
                .accountUsername(log.getAccount() != null ? log.getAccount().getUsername() : "system")
                .action(log.getAction())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
