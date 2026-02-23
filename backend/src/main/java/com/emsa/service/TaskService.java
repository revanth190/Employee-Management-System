package com.emsa.service;

import com.emsa.dto.request.TaskRequest;
import com.emsa.dto.response.TaskResponse;
import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, String assignedByUsername);
    TaskResponse getTaskById(Long id);
    List<TaskResponse> getAllTasks();
    List<TaskResponse> getMyTasks(String username);
    List<TaskResponse> getTasksByProject(Long projectId);
    TaskResponse updateTask(Long id, TaskRequest request, String username);
    void deleteTask(Long id);
}
