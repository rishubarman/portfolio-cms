package com.rishubarman.portfoliocms.auth;

import com.rishubarman.portfoliocms.jwt.JwtService;
import com.rishubarman.portfoliocms.user.CustomUserDetailsService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String accessToken =
                jwtService.generateToken(userDetails);

        String refreshToken =
                jwtService.generateRefreshToken(userDetails);

        return new LoginResponse(
                accessToken,
                refreshToken
        );
    }

    @PostMapping("/refresh")
    public LoginResponse refresh(
            @RequestBody RefreshRequest request
    ) {

        String refreshToken = request.getRefreshToken();

        String username =
                jwtService.extractUsername(refreshToken);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);

        if (!jwtService.isRefreshTokenValid(
                refreshToken,
                userDetails
        )) {
            throw new RuntimeException("Invalid refresh token");
        }

        String newAccessToken =
                jwtService.generateToken(userDetails);

        return new LoginResponse(
                newAccessToken,
                refreshToken
        );
    }
}