package com.emsa.service.impl;

import com.emsa.dto.request.LoginRequest;
import com.emsa.dto.response.AuthResponse;
import com.emsa.entity.Account;
import com.emsa.exception.ResourceNotFoundException;
import com.emsa.repository.AccountRepository;
import com.emsa.security.JwtTokenProvider;
import com.emsa.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Account", 0L));

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .accountId(account.getAccountId())
                .username(account.getUsername())
                .email(account.getEmail())
                .fullName(account.getFirstName() + " " + account.getLastName())
                .role(account.getRole())
                .build();
    }
}
