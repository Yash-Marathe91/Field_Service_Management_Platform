package com.zidio.keystone.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PartCreateRequest {

    @NotBlank(message = "Part code is required")
    private String partNumber;

    @NotBlank(message = "Part name is required")
    private String name;

    private String description;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.00", message = "Price cannot be negative")
    private BigDecimal unitPrice;

    @NotNull(message = "Quantity on hand is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantityOnHand;

    @Min(value = 0, message = "Minimum stock level cannot be negative")
    private Integer minimumStockLevel;

    public PartCreateRequest() {}

    public PartCreateRequest(String partNumber, String name, String description, BigDecimal unitPrice, Integer quantityOnHand, Integer minimumStockLevel) {
        this.partNumber = partNumber;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.quantityOnHand = quantityOnHand;
        this.minimumStockLevel = minimumStockLevel;
    }

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
}
