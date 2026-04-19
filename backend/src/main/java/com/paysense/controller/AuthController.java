package com.paysense.controller;

import com.paysense.dto.*;
import com.paysense.entity.User;
import com.paysense.service.UserService;
import com.paysense.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignUpRequest request) {
        User user = userService.registerUser(request);
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(userService.toDTO(user));
        response.setMessage("User registered successfully");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        User user = userService.getUserByEmail(request.getEmail());
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().build();
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(userService.toDTO(user));
        response.setMessage("Login successful");

        return ResponseEntity.ok(response);
    }
}
