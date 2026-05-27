package com.example.ExpenseTracker2.Repository;

import com.example.ExpenseTracker2.Entity.Expense;
import com.example.ExpenseTracker2.Entity.User;
import com.example.ExpenseTracker2.dto.CategoryExpenseSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);
    List<Expense> findByUserIdAndCategoryId(Long userId, Long categoryId);
    List<Expense> findByUserIdAndCategoryIdAndDateBetween(
            Long userId, Long categoryId, LocalDate startDate, LocalDate endDate
    );
    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    Page<Expense> findByUserOrderByDateDesc(User user, Pageable pageable);
    Page<Expense> findByUser(User user, Pageable pageable);
    @Query("""
            SELECT new com.example.ExpenseTracker2.dto.CategoryExpenseSummaryDTO(
            e.category.name,
            SUM(e.amount)
            )
            FROM Expense e
            WHERE e.user.id = :userId
            GROUP BY e.category.name
            """)
    List<CategoryExpenseSummaryDTO> getCategoryWiseExpenseSummary(Long userId);

    @Query(value = """
            SELECT DATE_FORMAT(date, '%Y-%m') as month,
            SUM(amount) as totalAmount
            FROM expenses
            WHERE user_id = :userId
            GROUP BY DATE_FORMAT(date, '%Y-%m')
            ORDER BY month
             """, nativeQuery = true)
    List<Object[]> getMonthlyExpenseSummary(Long userId);

    @Query("""
            SELECT COALESCE(SUM(e.amount),0)
            FROM Expense e
            WHERE e.user.id = :userId
            """)
    Double getTotalExpense(Long userId);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND YEAR(e.date) = :year AND MONTH(e.date) = :month ORDER BY e.date DESC")
    List<Expense> findByUserIdAndMonthAndYear(Long userId, int month, int year);
}
