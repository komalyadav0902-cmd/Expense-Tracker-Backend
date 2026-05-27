package com.example.ExpenseTracker2.Controller;

import com.example.ExpenseTracker2.Entity.Expense;
import com.example.ExpenseTracker2.Entity.User;
import com.example.ExpenseTracker2.Repository.UserRepository;
import com.example.ExpenseTracker2.Service.ExpenseService;
import com.example.ExpenseTracker2.dto.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> createExpense(
            @Valid @RequestBody ExpenseRequestDTO requestDTO,
            Authentication authentication) {

        String username = authentication.getName();

        ExpenseResponseDTO response = expenseService.createExpense(requestDTO, username);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public PagedResponseDTO<ExpenseResponseDTO> getAllExpenses(Pageable pageable) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String username = authentication.getName();

        return expenseService.getAllExpenses(pageable, username);
    }

    @GetMapping("/{id}")
    public ExpenseResponseDTO getExpenseById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        return expenseService.getExpenseById(id, username);
    }

    @GetMapping("/byMonth")
    public List<ExpenseResponseDTO> getByMonth(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication){
        return expenseService.getExpensesByMonth(authentication.getName(), month, year);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequestDTO expense,
            Authentication authentication) {

        Expense updated = expenseService.updateExpense(id, expense, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, Authentication authentication) {
        expenseService.deleteExpense(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics/category")
    public List<CategoryExpenseSummaryDTO> getCategoryAnalytics(Authentication auth) {
        return expenseService.getCategoryAnalytics(auth.getName());
    }

    @GetMapping("/analytics/monthly")
    public List<MontlyExpenseSummaryDTO> getMonthlyAnalytics(Authentication auth) {
        return expenseService.getMontlyAnalytics(auth.getName());
    }

    @GetMapping("/analytics/total")
    public Double getTotalExpense(Authentication auth) {
        return expenseService.getTotalExpense(auth.getName());
    }

    @GetMapping("/filter")
    public List<ExpenseResponseDTO> filterExpenses(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return expenseService.filterExpenses(username, categoryId, startDate, endDate);
    }

}
