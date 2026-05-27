package com.example.ExpenseTracker2.dto;

public class CategoryExpenseSummaryDTO {
    private String categoryName;
    private Double totalAmount;

    public CategoryExpenseSummaryDTO(String categoryName, Double totalAmount) {
        this.categoryName = categoryName;
        this.totalAmount = totalAmount;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }
}
