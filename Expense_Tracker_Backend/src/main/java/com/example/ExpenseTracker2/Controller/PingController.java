package com.example.ExpenseTracker2.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/public-ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("OK");
    }
}
