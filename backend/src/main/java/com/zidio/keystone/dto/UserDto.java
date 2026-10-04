package com.zidio.keystone.dto;

import com.zidio.keystone.domain.Role;

public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private String phone;
    private Long customerId;
    private String customerName;

    public UserDto() {}

    public UserDto(Long id, String email, String fullName, Role role, String phone, Long customerId, String customerName) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.phone = phone;
        this.customerId = customerId;
        this.customerName = customerName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
}
