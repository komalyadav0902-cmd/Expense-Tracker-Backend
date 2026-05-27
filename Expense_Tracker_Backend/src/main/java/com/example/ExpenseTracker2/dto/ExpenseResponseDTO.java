package com.example.ExpenseTracker2.dto;

import java.time.LocalDate;

public class ExpenseResponseDTO {

    private Long id;
    private String title;
    private double amount;
    private LocalDate date;
    private String userName;
    private String categoryName;

    public ExpenseResponseDTO(){
    }

    public ExpenseResponseDTO(Long id, String title, double amount,
                              LocalDate date, String userName, String categoryName) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.userName = userName;
        this.categoryName = categoryName;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public double getAmount() {
        return amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getUserName() {
        return userName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
