package com.zidio.keystone.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PartUsageRequest {

    @NotNull(message = "Part ID is required")
    private Long partId;

    @NotNull(message = "Quantity used is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantityUsed;

    private String notes;

    public PartUsageRequest() {}

    public PartUsageRequest(Long partId, Integer quantityUsed, String notes) {
        this.partId = partId;
        this.quantityUsed = quantityUsed;
        this.notes = notes;
    }

    public Long getPartId() { return partId; }
    public void setPartId(Long partId) { this.partId = partId; }

    public Integer getQuantityUsed() { return quantityUsed; }
    public void setQuantityUsed(Integer quantityUsed) { this.quantityUsed = quantityUsed; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
