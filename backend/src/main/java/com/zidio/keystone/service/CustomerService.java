package com.zidio.keystone.service;

import com.zidio.keystone.domain.Customer;
import com.zidio.keystone.dto.CustomerCreateRequest;
import com.zidio.keystone.dto.CustomerDto;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    public CustomerDto createCustomer(CustomerCreateRequest request) {
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setContactPerson(request.getContactPerson());

        Customer saved = customerRepository.save(customer);
        return mapToDto(saved);
    }

    @Transactional
    public CustomerDto updateCustomer(Long id, CustomerCreateRequest request) {
        Long safeId = Objects.requireNonNull(id, "Customer ID must not be null");
        Customer customer = customerRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + safeId));

        if (request.getName() != null) customer.setName(request.getName());
        if (request.getEmail() != null) customer.setEmail(request.getEmail());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());
        if (request.getContactPerson() != null) customer.setContactPerson(request.getContactPerson());

        Customer updated = customerRepository.save(customer);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Long safeId = Objects.requireNonNull(id, "Customer ID must not be null");
        if (!customerRepository.existsById(safeId)) {
            throw new ResourceNotFoundException("Customer not found with id: " + safeId);
        }
        customerRepository.deleteById(safeId);
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Long id) {
        Long safeId = Objects.requireNonNull(id, "Customer ID must not be null");
        Customer customer = customerRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + safeId));
        return mapToDto(customer);
    }

    @Transactional(readOnly = true)
    public Page<CustomerDto> getCustomers(String query, Pageable pageable) {
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        Page<Customer> customers;
        if (query != null && !query.trim().isEmpty()) {
            customers = customerRepository.findByNameContainingIgnoreCase(query.trim(), safePageable);
        } else {
            customers = customerRepository.findAll(safePageable);
        }
        return customers.map(this::mapToDto);
    }

    public CustomerDto mapToDto(Customer customer) {
        if (customer == null) return null;
        return new CustomerDto(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getContactPerson(),
                customer.getCreatedAt()
        );
    }
}
