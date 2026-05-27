package com.example.ExpenseTracker2.Exception;

public class ExpenseNotFoundException extends RuntimeException{
    public ExpenseNotFoundException(String message){
        super(message);
    }
}
