package com.emsa.controller;

import com.emsa.dto.request.LoginRequest;
import com.emsa.dto.response.ApiResponse;
import com.emsa.dto.response.AuthResponse;
import com.emsa.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login and Logout endpoints for all roles")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login - All roles (ADMIN, MANAGER, EMPLOYEE, USER)",
               description = "Authenticate with username and password. Returns JWT token.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout - All authenticated users",
               description = "Logout - client should discard the JWT token.")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully. Please discard your token.", null));
    }
}
