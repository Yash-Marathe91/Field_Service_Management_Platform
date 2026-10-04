package com.zidio.keystone.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PartUsageDto {

    private Long id;
    private Long workOrderId;
    private Long partId;
    private String partNumber;
    private String partName;
    private Integer quantityUsed;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String loggedByName;
    private LocalDateTime loggedAt;
    private String notes;

    public PartUsageDto() {}

    public PartUsageDto(Long id, Long workOrderId, Long partId, String partNumber, String partName, Integer quantityUsed, BigDecimal unitPrice, BigDecimal totalPrice, String loggedByName, LocalDateTime loggedAt, String notes) {
        this.id = id;
        this.workOrderId = workOrderId;
        this.partId = partId;
        this.partNumber = partNumber;
        this.partName = partName;
        this.quantityUsed = quantityUsed;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.loggedByName = loggedByName;
        this.loggedAt = loggedAt;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(Long workOrderId) { this.workOrderId = workOrderId; }

    public Long getPartId() { return partId; }
    public void setPartId(Long partId) { this.partId = partId; }

    public String getPartNumber() { return partNumber; }
    public void setPartNumber(String partNumber) { this.partNumber = partNumber; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public Integer getQuantityUsed() { return quantityUsed; }
    public void setQuantityUsed(Integer quantityUsed) { this.quantityUsed = quantityUsed; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getLoggedByName() { return loggedByName; }
    public void setLoggedByName(String loggedByName) { this.loggedByName = loggedByName; }

    public LocalDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
