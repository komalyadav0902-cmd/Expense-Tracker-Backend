package com.example.ExpenseTracker2.IntegrationTesting;

import com.example.ExpenseTracker2.Entity.Category;
import com.example.ExpenseTracker2.Entity.Expense;
import com.example.ExpenseTracker2.Entity.User;
import com.example.ExpenseTracker2.Repository.CategoryRepository;
import com.example.ExpenseTracker2.Repository.ExpenseRepository;
import com.example.ExpenseTracker2.Repository.UserRepository;
import com.example.ExpenseTracker2.Service.ExpenseService;
import com.example.ExpenseTracker2.dto.CategoryExpenseSummaryDTO;
import com.example.ExpenseTracker2.dto.ExpenseRequestDTO;
import com.example.ExpenseTracker2.dto.ExpenseResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest{

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ExpenseService expenseService;

    @Test
    void testCreateExpense(){

        ExpenseRequestDTO dto = new ExpenseRequestDTO();
        dto.setTitle("Lunch");
        dto.setAmount(200.0);
        dto.setDate(LocalDate.now());
        dto.setCategoryId(1L);

        User user = new User();
        user.setId(1L);
        user.setName("Komal");

        Category category = new Category();
        category.setId(1L);
        category.setName("Food");

        Expense expense = new Expense();
        expense.setId(1L);
        expense.setTitle("Lunch");
        expense.setAmount(200.0);
        expense.setUser(user);
        expense.setCategory(category);

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(category));

        when(expenseRepository.save(any(Expense.class)))
                .thenReturn(expense);

        ExpenseResponseDTO result = expenseService.createExpense(dto, "test@gmail.com");

        assertNotNull(result);
        assertEquals("Lunch", result.getTitle());
        assertEquals(200.0, result.getAmount());

        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    void testGetExpenseById() {

        User user = new User();
        user.setId(1L);
        user.setName("Komal");

        Category category = new Category();
        category.setId(1L);
        category.setName("Food");

        Expense expense = new Expense();
        expense.setId(1L);
        expense.setTitle("Lunch");
        expense.setAmount(200.0);
        expense.setUser(user);
        expense.setCategory(category);

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(expenseRepository.findById(1L))
                .thenReturn(Optional.of(expense));

        ExpenseResponseDTO result =
                expenseService.getExpenseById(1L, "test@gmail.com");

        assertNotNull(result);
        assertEquals("Lunch", result.getTitle());
    }

    @Test
    void testDeleteExpense() {

        Expense expense = new Expense();
        expense.setId(1L);

        when(expenseRepository.findById(1L))
                .thenReturn(Optional.of(expense));

        expenseService.deleteExpense(1L);

        verify(expenseRepository).delete(expense);
    }

    @Test
    void testCategoryAnalytics() {

        User user = new User();
        user.setId(1L);

        List<CategoryExpenseSummaryDTO> analytics =
                List.of(new CategoryExpenseSummaryDTO("Food", 500.0));

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(expenseRepository.getCategoryWiseExpenseSummary(1L))
                .thenReturn(analytics);

        List<CategoryExpenseSummaryDTO> result =
                expenseService.getCategoryAnalytics("test@gmail.com");

        assertEquals(1, result.size());
        assertEquals("Food", result.get(0).getCategoryName());
    }
}