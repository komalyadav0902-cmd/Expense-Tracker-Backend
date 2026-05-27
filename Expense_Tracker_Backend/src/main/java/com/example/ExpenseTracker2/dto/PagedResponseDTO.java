package com.example.ExpenseTracker2.dto;

import java.util.List;

public class PagedResponseDTO<T> {

    private List<T> data;
    private int currentPage;
    private int totalPages;
    private long totalItems;
    private int pageSize;

    public PagedResponseDTO(List<T> data, int currentPage, int totalPages, long totalItems, int pageSize) {
        this.data = data;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.pageSize = pageSize;
    }

    public List<T> getData() {
        return data;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public int getPageSize() {
        return pageSize;
    }
}
