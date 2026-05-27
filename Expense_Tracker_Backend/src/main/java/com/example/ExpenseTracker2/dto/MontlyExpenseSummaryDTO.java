package com.example.ExpenseTracker2.dto;

public class MontlyExpenseSummaryDTO {

    private String month;
    private Double totalAmount;

    public MontlyExpenseSummaryDTO(String month, Double totalAmount) {
        this.month = month;
        this.totalAmount = totalAmount;
    }

    public String getMonth() {
        return month;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }
}
