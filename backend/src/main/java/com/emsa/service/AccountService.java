package com.emsa.service;

import com.emsa.dto.request.*;
import com.emsa.dto.response.AccountResponse;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(CreateAccountRequest request);
    AccountResponse getAccountById(Long id);
    AccountResponse getMyProfile(String username);
    List<AccountResponse> getAllAccounts();
    List<AccountResponse> getAccountsByRole(String role);
    AccountResponse updateAccount(Long id, UpdateAccountRequest request);
    AccountResponse updateMyProfile(String username, UpdateAccountRequest request);
    void deactivateAccount(Long id);
    void activateAccount(Long id);
    void deleteAccount(Long id);
    void resetPassword(Long id, ResetPasswordRequest request);
    void changeMyPassword(String username, ChangePasswordRequest request);
    List<AccountResponse> getTeamMembers(String managerUsername);
}
