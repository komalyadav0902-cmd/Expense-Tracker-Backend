package com.example.ExpenseTracker2.Service;

import com.example.ExpenseTracker2.Entity.Category;
import com.example.ExpenseTracker2.Entity.Expense;
import com.example.ExpenseTracker2.Entity.User;
import com.example.ExpenseTracker2.Exception.CategoryNotFoundException;
import com.example.ExpenseTracker2.Exception.ExpenseNotFoundException;
import com.example.ExpenseTracker2.Exception.UserNotFoundException;
import com.example.ExpenseTracker2.Repository.CategoryRepository;
import com.example.ExpenseTracker2.Repository.ExpenseRepository;
import com.example.ExpenseTracker2.Repository.UserRepository;
import com.example.ExpenseTracker2.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository, CategoryRepository categoryRepository){
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public ExpenseResponseDTO createExpense(ExpenseRequestDTO dto, String username){

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                        .orElseThrow(() -> new CategoryNotFoundException("Category not found with id "
                                                             + dto.getCategoryId()));

        Expense expense = new Expense();
        expense.setTitle(dto.getTitle());
        expense.setAmount(dto.getAmount());
        expense.setDate(dto.getDate());
        expense.setUser(user);
        expense.setCategory(category);

        Expense savedExpense = expenseRepository.save(expense);

        return new ExpenseResponseDTO(savedExpense.getId(), savedExpense.getTitle(),
                savedExpense.getAmount(), savedExpense.getDate(), user.getName(), category.getName());
    }

    private ExpenseResponseDTO mapToDTO(Expense expense){
        ExpenseResponseDTO dto = new ExpenseResponseDTO();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setAmount(expense.getAmount());
        dto.setDate(expense.getDate());
        dto.setUserName(expense.getUser().getName());
        dto.setCategoryName(expense.getCategory().getName());
        return dto;
    }

    public PagedResponseDTO<ExpenseResponseDTO> getAllExpenses(Pageable pageable, String username){

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<Expense> expensePage = expenseRepository.findByUser(user, pageable);

        List<ExpenseResponseDTO> dtoList =
                expensePage.getContent().stream()
                        .map(this::mapToDTO)
                        .toList();

        return new PagedResponseDTO<>(
                dtoList,
                expensePage.getNumber(),
                expensePage.getTotalPages(),
                expensePage.getTotalElements(),
                expensePage.getSize()
        );
    }

    public ExpenseResponseDTO getExpenseById(Long id, String username){

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id));

        if (!expense.getUser().getId().equals(user.getId())){
            throw new RuntimeException("You are not allowed to access this expense");
        }

        return mapToDTO(expense);
    }

    public List<ExpenseResponseDTO> getExpensesByUserId(Long userId){
        return expenseRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ExpenseResponseDTO> getExpensesByMonth(String username, int month, int year){
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return expenseRepository.findByUserIdAndMonthAndYear(user.getId(), month, year)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public Expense updateExpense(Long id, ExpenseRequestDTO updatedExpense, String username){
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id: " + id));

        // IDOR Protection Check
        if (!existingExpense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this expense resource.");
        }

        Category category = categoryRepository.findById(updatedExpense.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));

        existingExpense.setTitle(updatedExpense.getTitle());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setCategory(category);
        existingExpense.setDate(updatedExpense.getDate());

        return expenseRepository.save(existingExpense);
    }

    public void deleteExpense(Long id, String username){
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Expense not found with id " + id));

        // IDOR Protection Check
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You do not own this expense resource.");
        }

        expenseRepository.delete(expense);
    }

    public List<CategoryExpenseSummaryDTO> getCategoryAnalytics(String username){

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return expenseRepository.getCategoryWiseExpenseSummary(user.getId());
    }

    public List<MontlyExpenseSummaryDTO> getMontlyAnalytics(String username){

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        List<Object[]> results = expenseRepository.getMonthlyExpenseSummary(user.getId());

        return results.stream()
                .map(r -> new MontlyExpenseSummaryDTO(
                        (String) r[0],
                        ((Number) r[1]).doubleValue()
                ))
                .toList();
    }

    public Double getTotalExpense(String username){

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return expenseRepository.getTotalExpense(user.getId());
    }

    public List<ExpenseResponseDTO> filterExpenses(
            String username, Long categoryId, LocalDate startDate, LocalDate endDate
    ){
        // Fetch the actual user object using email
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Long userId = user.getId();
        List<Expense> expenses;

        if (categoryId != null && startDate != null && endDate != null){
            expenses = expenseRepository.findByUserIdAndCategoryIdAndDateBetween(userId, categoryId, startDate, endDate);
        } else if (categoryId != null) {
            expenses = expenseRepository.findByUserIdAndCategoryId(userId, categoryId);
        } else if (startDate != null && endDate != null) {
            expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else {
            expenses = expenseRepository.findByUserId(userId);
        }

        return expenses.stream()
                .map(this::mapToDTO)
                .toList();
    }



}
