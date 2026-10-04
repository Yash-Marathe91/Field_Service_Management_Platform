package com.zidio.keystone.service;

import com.zidio.keystone.domain.Customer;
import com.zidio.keystone.domain.Site;
import com.zidio.keystone.dto.SiteCreateRequest;
import com.zidio.keystone.dto.SiteDto;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.repository.CustomerRepository;
import com.zidio.keystone.repository.SiteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class SiteService {

    private final SiteRepository siteRepository;
    private final CustomerRepository customerRepository;

    public SiteService(SiteRepository siteRepository, CustomerRepository customerRepository) {
        this.siteRepository = siteRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public SiteDto createSite(SiteCreateRequest request) {
        Long customerId = Objects.requireNonNull(request.getCustomerId(), "Customer ID must not be null");
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Site site = new Site();
        site.setCustomer(customer);
        site.setName(request.getName());
        site.setAddress(request.getAddress());
        site.setBuildingCode(request.getBuildingCode());
        site.setContactPerson(request.getContactPerson());
        site.setContactPhone(request.getContactPhone());

        Site saved = siteRepository.save(site);
        return mapToDto(saved);
    }

    @Transactional
    public SiteDto updateSite(Long id, SiteCreateRequest request) {
        Long safeId = Objects.requireNonNull(id, "Site ID must not be null");
        Site site = siteRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with id: " + safeId));

        if (request.getName() != null) site.setName(request.getName());
        if (request.getAddress() != null) site.setAddress(request.getAddress());
        if (request.getBuildingCode() != null) site.setBuildingCode(request.getBuildingCode());
        if (request.getContactPerson() != null) site.setContactPerson(request.getContactPerson());
        if (request.getContactPhone() != null) site.setContactPhone(request.getContactPhone());

        Site updated = siteRepository.save(site);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteSite(Long id) {
        Long safeId = Objects.requireNonNull(id, "Site ID must not be null");
        if (!siteRepository.existsById(safeId)) {
            throw new ResourceNotFoundException("Site not found with id: " + safeId);
        }
        siteRepository.deleteById(safeId);
    }

    @Transactional(readOnly = true)
    public List<SiteDto> getSitesByCustomer(Long customerId) {
        Long safeId = Objects.requireNonNull(customerId, "Customer ID must not be null");
        return siteRepository.findByCustomerId(safeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<SiteDto> getSites(String query, Pageable pageable) {
        Pageable safePageable = Objects.requireNonNull(pageable, "Pageable must not be null");
        Page<Site> sites;
        if (query != null && !query.trim().isEmpty()) {
            sites = siteRepository.findByNameContainingIgnoreCase(query.trim(), safePageable);
        } else {
            sites = siteRepository.findAll(safePageable);
        }
        return sites.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public SiteDto getSiteById(Long id) {
        Long safeId = Objects.requireNonNull(id, "Site ID must not be null");
        Site site = siteRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with id: " + safeId));
        return mapToDto(site);
    }

    public SiteDto mapToDto(Site site) {
        if (site == null) return null;
        return new SiteDto(
                site.getId(),
                site.getCustomer().getId(),
                site.getCustomer().getName(),
                site.getName(),
                site.getAddress(),
                site.getBuildingCode(),
                site.getContactPerson(),
                site.getContactPhone(),
                site.getCreatedAt()
        );
    }
}
