package com.zidio.keystone.dto;

import java.time.OffsetDateTime;

public class SiteDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String name;
    private String address;
    private String buildingCode;
    private String contactPerson;
    private String contactPhone;
    private OffsetDateTime createdAt;

    public SiteDto() {}

    public SiteDto(Long id, Long customerId, String customerName, String name, String address, String buildingCode, String contactPerson, String contactPhone, OffsetDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.name = name;
        this.address = address;
        this.buildingCode = buildingCode;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getBuildingCode() { return buildingCode; }
    public void setBuildingCode(String buildingCode) { this.buildingCode = buildingCode; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
