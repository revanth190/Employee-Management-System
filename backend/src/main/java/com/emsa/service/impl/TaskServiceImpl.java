package com.emsa.service.impl;

import com.emsa.dto.request.TaskRequest;
import com.emsa.dto.response.TaskResponse;
import com.emsa.entity.Account;
import com.emsa.entity.Project;
import com.emsa.entity.Task;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.ProjectRepository;
import com.emsa.repository.TaskRepository;
import com.emsa.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private AccountRepository accountRepository;

    @Override
    public TaskResponse createTask(TaskRequest request, String assignedByUsername) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
        Account assignedBy = accountRepository.findByUsername(assignedByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + assignedByUsername));

        Task task = Task.builder()
                .project(project)
                .assignedBy(assignedBy)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "TODO")
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .dueDate(request.getDueDate())
                .hoursLogged(request.getHoursLogged() != null ? request.getHoursLogged() : 0.0)
                .build();

        if (request.getAssignedToId() != null) {
            Account assignedTo = accountRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account", request.getAssignedToId()));
            task.setAssignedTo(assignedTo);
        }
        return toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        return toResponse(task);
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getMyTasks(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        return taskRepository.findByAssignedToAccountId(account.getAccountId()).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectProjectId(projectId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getHoursLogged() != null) task.setHoursLogged(request.getHoursLogged());
        if (request.getAssignedToId() != null) {
            Account assignedTo = accountRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account", request.getAssignedToId()));
            task.setAssignedTo(assignedTo);
        }
        return toResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task t) {
        return TaskResponse.builder()
                .taskId(t.getTaskId())
                .projectId(t.getProject().getProjectId())
                .projectName(t.getProject().getProjectName())
                .assignedToId(t.getAssignedTo() != null ? t.getAssignedTo().getAccountId() : null)
                .assignedToName(t.getAssignedTo() != null ? t.getAssignedTo().getFirstName() + " " + t.getAssignedTo().getLastName() : null)
                .assignedById(t.getAssignedBy() != null ? t.getAssignedBy().getAccountId() : null)
                .assignedByName(t.getAssignedBy() != null ? t.getAssignedBy().getFirstName() + " " + t.getAssignedBy().getLastName() : null)
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus())
                .priority(t.getPriority())
                .dueDate(t.getDueDate())
                .hoursLogged(t.getHoursLogged())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
