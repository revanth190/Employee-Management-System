package com.emsa.service.impl;

import com.emsa.dto.request.*;
import com.emsa.dto.response.AccountResponse;
import com.emsa.entity.Account;
import com.emsa.entity.Department;
import com.emsa.entity.RoleName;
import com.emsa.exception.BadRequestException;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.repository.DepartmentRepository;
import com.emsa.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AccountResponse createAccount(CreateAccountRequest request) {
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists: " + request.getUsername());
        }
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists: " + request.getEmail());
        }

        Account account = Account.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .hireDate(request.getHireDate())
                .designation(request.getDesignation())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .isActive(true)
                .build();

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));
            account.setDepartment(dept);
        }

        if (request.getReportingManagerId() != null) {
            Account manager = accountRepository.findById(request.getReportingManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", request.getReportingManagerId()));
            account.setReportingManager(manager);
        }

        return toResponse(accountRepository.save(account));
    }

    @Override
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));
        return toResponse(account);
    }

    @Override
    public AccountResponse getMyProfile(String username) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        return toResponse(account);
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountResponse> getAccountsByRole(String role) {
        RoleName roleName = RoleName.valueOf(role.toUpperCase());
        return accountRepository.findByRole(roleName).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse updateAccount(Long id, UpdateAccountRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));

        applyUpdates(account, request);
        return toResponse(accountRepository.save(account));
    }

    @Override
    public AccountResponse updateMyProfile(String username, UpdateAccountRequest request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        // Employees can't change their own role, isActive status
        request.setRole(null);
        request.setIsActive(null);
        applyUpdates(account, request);
        return toResponse(accountRepository.save(account));
    }

    private void applyUpdates(Account account, UpdateAccountRequest request) {
        if (request.getEmail() != null) account.setEmail(request.getEmail());
        if (request.getFirstName() != null) account.setFirstName(request.getFirstName());
        if (request.getLastName() != null) account.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) account.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null) account.setAddress(request.getAddress());
        if (request.getDateOfBirth() != null) account.setDateOfBirth(request.getDateOfBirth());
        if (request.getHireDate() != null) account.setHireDate(request.getHireDate());
        if (request.getDesignation() != null) account.setDesignation(request.getDesignation());
        if (request.getEmergencyContactName() != null) account.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) account.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getIsActive() != null) account.setIsActive(request.getIsActive());
        if (request.getRole() != null) account.setRole(request.getRole());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));
            account.setDepartment(dept);
        }

        if (request.getReportingManagerId() != null) {
            Account manager = accountRepository.findById(request.getReportingManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", request.getReportingManagerId()));
            account.setReportingManager(manager);
        }
    }

    @Override
    public void deactivateAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));
        account.setIsActive(false);
        accountRepository.save(account);
    }

    @Override
    public void activateAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));
        account.setIsActive(true);
        accountRepository.save(account);
    }

    @Override
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));
        accountRepository.delete(account);
    }

    @Override
    public void resetPassword(Long id, ResetPasswordRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));
        account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    @Override
    public void changeMyPassword(String username, ChangePasswordRequest request) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + username));
        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    @Override
    public List<AccountResponse> getTeamMembers(String managerUsername) {
        Account manager = accountRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found: " + managerUsername));
        return accountRepository.findByReportingManagerAccountId(manager.getAccountId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AccountResponse toResponse(Account account) {
        return AccountResponse.builder()
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .role(account.getRole())
                .firstName(account.getFirstName())
                .lastName(account.getLastName())
                .fullName(account.getFirstName() + " " + account.getLastName())
                .phoneNumber(account.getPhoneNumber())
                .address(account.getAddress())
                .dateOfBirth(account.getDateOfBirth())
                .hireDate(account.getHireDate())
                .designation(account.getDesignation())
                .departmentId(account.getDepartment() != null ? account.getDepartment().getDepartmentId() : null)
                .departmentName(account.getDepartment() != null ? account.getDepartment().getDepartmentName() : null)
                .reportingManagerId(account.getReportingManager() != null ? account.getReportingManager().getAccountId() : null)
                .reportingManagerName(account.getReportingManager() != null ?
                        account.getReportingManager().getFirstName() + " " + account.getReportingManager().getLastName() : null)
                .emergencyContactName(account.getEmergencyContactName())
                .emergencyContactPhone(account.getEmergencyContactPhone())
                .isActive(account.getIsActive())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
