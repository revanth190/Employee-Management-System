package com.emsa.service;

import com.emsa.dto.request.KpiRequest;
import com.emsa.dto.response.KpiResponse;
import java.util.List;

public interface KpiService {
    KpiResponse createKpi(String assignedByUsername, KpiRequest request);
    KpiResponse getKpiById(Long id);
    List<KpiResponse> getMyKpis(String username);
    List<KpiResponse> getKpisByEmployee(Long employeeId);
    KpiResponse updateKpi(Long id, KpiRequest request, String username);
    void deleteKpi(Long id);
}
