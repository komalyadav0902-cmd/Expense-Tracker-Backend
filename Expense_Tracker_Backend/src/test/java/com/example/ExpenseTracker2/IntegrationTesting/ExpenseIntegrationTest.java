package com.example.ExpenseTracker2.IntegrationTesting;

import com.example.ExpenseTracker2.Entity.Category;
import com.example.ExpenseTracker2.Entity.Expense;
import com.example.ExpenseTracker2.Entity.User;
import com.example.ExpenseTracker2.Repository.CategoryRepository;
import com.example.ExpenseTracker2.Repository.ExpenseRepository;
import com.example.ExpenseTracker2.Repository.UserRepository;
import com.example.ExpenseTracker2.dto.ExpenseRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc // ✅ IMPORTANT: removed addFilters = false
@Transactional
@Import(TestSecurityConfig.class)
@ActiveProfiles("test")
public class ExpenseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private Category category;
    private User user;

    @BeforeEach
    void setup(){
        category = new Category();
        category.setName("Living");
        category = categoryRepository.save(category);

        user = new User();
        user.setName("Test User");
        user.setEmail("test@gmail.com"); // MUST match @WithMockUser
        user.setPassword("password");

        user = userRepository.save(user);
    }

    @Test
    @WithMockUser(username = "test@gmail.com") // ✅ simulate logged-in user
    void testCreateExpense() throws Exception{

        ExpenseRequestDTO dto = new ExpenseRequestDTO();
        dto.setTitle("Lunch");
        dto.setAmount(200.0);
        dto.setDate(LocalDate.now());
        dto.setCategoryId(category.getId());

        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Lunch"))
                .andExpect(jsonPath("$.amount").value(200.0));

        // DB verification
        assertEquals(1, expenseRepository.count());

        Expense saved = expenseRepository.findAll().get(0);
        assertEquals("Lunch", saved.getTitle());
        assertEquals(200.0, saved.getAmount(), 0.01);
    }

    @Test
    @WithMockUser(username = "test@gmail.com")
    void testGetAllExpense() throws Exception{

        ExpenseRequestDTO dto = new ExpenseRequestDTO();
        dto.setTitle("Lunch");
        dto.setAmount(200.0);
        dto.setDate(LocalDate.now());
        dto.setCategoryId(category.getId());

        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("Lunch"))
                .andExpect(jsonPath("$.data[0].amount").value(200.0));
    }

    @Test
    @WithMockUser(username = "test@gmail.com")
    void testCreateExpense_InvalidData() throws Exception{

        ExpenseRequestDTO dto = new ExpenseRequestDTO();
        dto.setAmount(200.0);
        dto.setDate(LocalDate.now());
        dto.setCategoryId(category.getId());

        mockMvc.perform(post("/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }
}