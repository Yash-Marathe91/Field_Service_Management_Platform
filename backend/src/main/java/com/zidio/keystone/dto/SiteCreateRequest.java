package com.zidio.keystone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SiteCreateRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Site name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String buildingCode;
    private String contactPerson;
    private String contactPhone;

    public SiteCreateRequest() {}

    public SiteCreateRequest(Long customerId, String name, String address, String buildingCode, String contactPerson, String contactPhone) {
        this.customerId = customerId;
        this.name = name;
        this.address = address;
        this.buildingCode = buildingCode;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

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
}
