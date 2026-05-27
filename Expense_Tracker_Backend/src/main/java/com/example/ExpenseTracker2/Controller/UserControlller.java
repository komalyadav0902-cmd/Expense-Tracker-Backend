package com.example.ExpenseTracker2.Controller;


import com.example.ExpenseTracker2.Entity.Expense;
import com.example.ExpenseTracker2.Entity.User;
import com.example.ExpenseTracker2.Service.ExpenseService;
import com.example.ExpenseTracker2.Service.UserService;
import com.example.ExpenseTracker2.dto.ExpenseResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserControlller {

    private final UserService userService;

    private final ExpenseService expenseService;

    public UserControlller(UserService userService, ExpenseService expenseService){
        this.userService = userService;
        this.expenseService = expenseService;
    }

    @PostMapping
    public User createUser(@Valid @RequestBody User user){
        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getAllUser();
    }

    @GetMapping("/{userId}/expenses")
    public List<ExpenseResponseDTO> getExpenseByUser(@PathVariable Long userId){
        return expenseService.getExpensesByUserId(userId);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }
}
