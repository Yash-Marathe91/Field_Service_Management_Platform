package com.zidio.keystone.controller;

import com.zidio.keystone.dto.SiteCreateRequest;
import com.zidio.keystone.dto.SiteDto;
import com.zidio.keystone.service.SiteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@Tag(name = "Sites", description = "Endpoints for Customer Sites & Locations")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    @Operation(summary = "Create Site")
    public ResponseEntity<SiteDto> createSite(@Valid @RequestBody SiteCreateRequest request) {
        SiteDto created = siteService.createSite(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    @Operation(summary = "Update Site")
    public ResponseEntity<SiteDto> updateSite(@PathVariable Long id, @Valid @RequestBody SiteCreateRequest request) {
        return ResponseEntity.ok(siteService.updateSite(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER')")
    @Operation(summary = "Delete Site")
    public ResponseEntity<Void> deleteSite(@PathVariable Long id) {
        siteService.deleteSite(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "List Customer Sites")
    public ResponseEntity<List<SiteDto>> getSitesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(siteService.getSitesByCustomer(customerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Site Details")
    public ResponseEntity<SiteDto> getSiteById(@PathVariable Long id) {
        return ResponseEntity.ok(siteService.getSiteById(id));
    }

    @GetMapping
    @Operation(summary = "Search Sites")
    public ResponseEntity<Page<SiteDto>> getSites(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(siteService.getSites(search, pageable));
    }
}
