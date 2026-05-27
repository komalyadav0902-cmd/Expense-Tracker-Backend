package com.example.ExpenseTracker2.Controller;

import com.example.ExpenseTracker2.Security.JWTService;
import com.example.ExpenseTracker2.dto.LoginRequestDTO;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Profile("!test")
public class JwtTestController {

    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    public JwtTestController(AuthenticationManager authenticationManager, JWTService jwtService){
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequestDTO requestDTO){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDTO.getEmail(),
                        requestDTO.getPassword()
                )
        );

        String token = jwtService.generateToken(requestDTO.getEmail());
        return Map.of("token", token);
    }

    @GetMapping("/generate")
    public String generateToken(){
        return jwtService.generateToken("komal@example.com");
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam String token){
        String username = jwtService.extractUsername(token);
        return "Extracted Username: " + username;
    }
}
