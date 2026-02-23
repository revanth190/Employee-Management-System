package com.emsa.service.impl;

import com.emsa.dto.request.ProjectRequest;
import com.emsa.dto.response.ProjectResponse;
import com.emsa.entity.Account;
import com.emsa.entity.Project;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.ProjectRepository;
import com.emsa.repository.TaskRepository;
import com.emsa.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private TaskRepository taskRepository;

    @Override
    public ProjectResponse createProject(ProjectRequest request, String createdByUsername) {
        Project project = Project.builder()
                .projectName(request.getProjectName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        if (request.getManagerId() != null) {
            Account manager = accountRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", request.getManagerId()));
            project.setManager(manager);
        } else {
            Account manager = accountRepository.findByUsername(createdByUsername)
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
            project.setManager(manager);
        }
        return toResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        return toResponse(projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id)));
    }

    @Override
    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        // Initialize lazy-loaded relationships within transaction context
        projects.forEach(p -> {
            if (p.getTasks() != null) {
                p.getTasks().size(); // Force loading
            }
        });
        return projects.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponse> getMyProjects(String managerUsername) {
        Account manager = accountRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + managerUsername));
        List<Project> projects = projectRepository.findByManagerAccountId(manager.getAccountId());
        // Initialize lazy-loaded relationships within transaction context
        projects.forEach(p -> {
            if (p.getTasks() != null) {
                p.getTasks().size(); // Force loading
            }
        });
        return projects.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponse> getAssignedProjects(String employeeUsername) {
        Account employee = accountRepository.findByUsername(employeeUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + employeeUsername));
        // Get all tasks assigned to this employee and extract unique projects
        List<Project> projects = taskRepository.findByAssignedToAccountId(employee.getAccountId())
                .stream()
                .map(task -> task.getProject())
                .distinct()
                .collect(Collectors.toList());
        // Initialize lazy-loaded relationships within transaction context
        projects.forEach(p -> {
            if (p.getTasks() != null) {
                p.getTasks().size(); // Force loading
            }
        });
        return projects.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        if (request.getProjectName() != null) project.setProjectName(request.getProjectName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getStartDate() != null) project.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) project.setEndDate(request.getEndDate());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        if (request.getManagerId() != null) {
            Account manager = accountRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", request.getManagerId()));
            project.setManager(manager);
        }
        return toResponse(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project p) {
        return ProjectResponse.builder()
                .projectId(p.getProjectId())
                .projectName(p.getProjectName())
                .description(p.getDescription())
                .managerId(p.getManager() != null ? p.getManager().getAccountId() : null)
                .managerName(p.getManager() != null ? p.getManager().getFirstName() + " " + p.getManager().getLastName() : null)
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .status(p.getStatus())
                .taskCount(p.getTasks() != null ? p.getTasks().size() : 0)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
