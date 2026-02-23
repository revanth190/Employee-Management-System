package com.emsa.controller;

import com.emsa.dto.request.*;
import com.emsa.dto.response.AccountResponse;
import com.emsa.dto.response.ApiResponse;
import com.emsa.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Account Management", description = "Manage accounts for all roles")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create account [ADMIN only]", description = "Create ADMIN, MANAGER, EMPLOYEE, or USER account")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all accounts [ADMIN only]")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved", accountService.getAllAccounts()));
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get accounts by role [ADMIN, MANAGER]", description = "role: ADMIN, MANAGER, EMPLOYEE, USER")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved", accountService.getAccountsByRole(role)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get account by ID [ADMIN, MANAGER]")
    public ResponseEntity<ApiResponse<AccountResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Account retrieved", accountService.getAccountById(id)));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my profile [All roles]")
    public ResponseEntity<ApiResponse<AccountResponse>> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", accountService.getMyProfile(authentication.getName())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update account [ADMIN only]")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(@PathVariable Long id,
                                                                       @RequestBody UpdateAccountRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Account updated", accountService.updateAccount(id, request)));
    }

    @PutMapping("/me")
    @Operation(summary = "Update my profile [All roles]", description = "Employees can update their own basic info")
    public ResponseEntity<ApiResponse<AccountResponse>> updateMyProfile(Authentication authentication,
                                                                         @RequestBody UpdateAccountRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", accountService.updateMyProfile(authentication.getName(), request)));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate account [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount(@PathVariable Long id) {
        accountService.deactivateAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account deactivated", null));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate account [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> activateAccount(@PathVariable Long id) {
        accountService.activateAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account activated", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete account [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }

    @PatchMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reset password [ADMIN only]")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@PathVariable Long id,
                                                            @Valid @RequestBody ResetPasswordRequest request) {
        accountService.resetPassword(id, request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null));
    }

    @PatchMapping("/me/change-password")
    @Operation(summary = "Change my password [All roles]")
    public ResponseEntity<ApiResponse<Void>> changePassword(Authentication authentication,
                                                             @Valid @RequestBody ChangePasswordRequest request) {
        accountService.changeMyPassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @GetMapping("/team")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get team members [MANAGER, ADMIN]")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getTeamMembers(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Team members retrieved", accountService.getTeamMembers(authentication.getName())));
    }
}
