package com.zidio.keystone.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PartDto {

    private Long id;
    private String partNumber;
    private String name;
    private String description;
    private BigDecimal unitPrice;
    private Integer quantityOnHand;
    private Integer minimumStockLevel;
    private boolean lowStock;
    private LocalDateTime createdAt;

    public PartDto() {}

    public PartDto(Long id, String partNumber, String name, String description, BigDecimal unitPrice, Integer quantityOnHand, Integer minimumStockLevel, boolean lowStock, LocalDateTime createdAt) {
        this.id = id;
        this.partNumber = partNumber;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.quantityOnHand = quantityOnHand;
        this.minimumStockLevel = minimumStockLevel;
        this.lowStock = lowStock;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPartNumber() { return partNumber; }
    public void setPartNumber(String partNumber) { this.partNumber = partNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantityOnHand() { return quantityOnHand; }
    public void setQuantityOnHand(Integer quantityOnHand) { this.quantityOnHand = quantityOnHand; }

    public Integer getMinimumStockLevel() { return minimumStockLevel; }
    public void setMinimumStockLevel(Integer minimumStockLevel) { this.minimumStockLevel = minimumStockLevel; }

    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) { this.lowStock = lowStock; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
