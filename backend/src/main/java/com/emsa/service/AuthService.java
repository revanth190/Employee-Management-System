package com.emsa.service;

import com.emsa.dto.request.LoginRequest;
import com.emsa.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
