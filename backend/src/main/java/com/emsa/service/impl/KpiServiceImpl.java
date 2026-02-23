package com.emsa.service.impl;

import com.emsa.dto.request.KpiRequest;
import com.emsa.dto.response.KpiResponse;
import com.emsa.entity.Account;
import com.emsa.entity.Kpi;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.KpiRepository;
import com.emsa.service.KpiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class KpiServiceImpl implements KpiService {

    @Autowired private KpiRepository kpiRepository;
    @Autowired private AccountRepository accountRepository;

    @Override
    public KpiResponse createKpi(String assignedByUsername, KpiRequest request) {
        Account assignedBy = accountRepository.findByUsername(assignedByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + assignedByUsername));
        Account employee = accountRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", request.getEmployeeId()));

        Kpi kpi = Kpi.builder()
                .employee(employee)
                .assignedBy(assignedBy)
                .title(request.getTitle())
                .description(request.getDescription())
                .targetValue(request.getTargetValue())
                .achievedValue(request.getAchievedValue())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING")
                .dueDate(request.getDueDate())
                .build();
        return toResponse(kpiRepository.save(kpi));
    }

    @Override
    public KpiResponse getKpiById(Long id) {
        return toResponse(kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KPI", id)));
    }

    @Override
    public List<KpiResponse> getMyKpis(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        return kpiRepository.findByEmployeeAccountId(account.getAccountId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<KpiResponse> getKpisByEmployee(Long employeeId) {
        return kpiRepository.findByEmployeeAccountId(employeeId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public KpiResponse updateKpi(Long id, KpiRequest request, String username) {
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KPI", id));
        if (request.getTitle() != null) kpi.setTitle(request.getTitle());
        if (request.getDescription() != null) kpi.setDescription(request.getDescription());
        if (request.getTargetValue() != null) kpi.setTargetValue(request.getTargetValue());
        if (request.getAchievedValue() != null) kpi.setAchievedValue(request.getAchievedValue());
        if (request.getStatus() != null) kpi.setStatus(request.getStatus());
        if (request.getDueDate() != null) kpi.setDueDate(request.getDueDate());
        return toResponse(kpiRepository.save(kpi));
    }

    @Override
    public void deleteKpi(Long id) {
        Kpi kpi = kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KPI", id));
        kpiRepository.delete(kpi);
    }

    private KpiResponse toResponse(Kpi kpi) {
        return KpiResponse.builder()
                .kpiId(kpi.getKpiId())
                .employeeId(kpi.getEmployee().getAccountId())
                .employeeName(kpi.getEmployee().getFirstName() + " " + kpi.getEmployee().getLastName())
                .assignedById(kpi.getAssignedBy().getAccountId())
                .assignedByName(kpi.getAssignedBy().getFirstName() + " " + kpi.getAssignedBy().getLastName())
                .title(kpi.getTitle())
                .description(kpi.getDescription())
                .targetValue(kpi.getTargetValue())
                .achievedValue(kpi.getAchievedValue())
                .status(kpi.getStatus())
                .dueDate(kpi.getDueDate())
                .createdAt(kpi.getCreatedAt())
                .build();
    }
}
