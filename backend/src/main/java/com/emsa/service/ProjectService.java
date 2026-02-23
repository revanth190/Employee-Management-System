package com.emsa.service;

import com.emsa.dto.request.ProjectRequest;
import com.emsa.dto.response.ProjectResponse;
import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request, String createdByUsername);
    ProjectResponse getProjectById(Long id);
    List<ProjectResponse> getAllProjects();
    List<ProjectResponse> getMyProjects(String managerUsername);
    List<ProjectResponse> getAssignedProjects(String employeeUsername);
    ProjectResponse updateProject(Long id, ProjectRequest request);
    void deleteProject(Long id);
}
