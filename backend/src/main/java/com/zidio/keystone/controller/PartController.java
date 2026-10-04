package com.zidio.keystone.controller;

import com.zidio.keystone.dto.PartCreateRequest;
import com.zidio.keystone.dto.PartDto;
import com.zidio.keystone.dto.PartUsageDto;
import com.zidio.keystone.dto.PartUsageRequest;
import com.zidio.keystone.service.PartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Parts & Inventory Management", description = "Endpoints for spare parts inventory and work order parts consumption")
public class PartController {

    private final PartService partService;

    public PartController(PartService partService) {
        this.partService = partService;
    }

    @GetMapping("/parts")
    @Operation(summary = "Get inventory parts catalog with low-stock indicators")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<Page<PartDto>> getParts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(partService.getParts(search, page, size));
    }

    @GetMapping("/parts/{id}")
    @Operation(summary = "Get part details by ID")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<PartDto> getPartById(@PathVariable Long id) {
        return ResponseEntity.ok(partService.getPartById(id));
    }

    @PostMapping("/parts")
    @Operation(summary = "Create inventory part item")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<PartDto> createPart(@Valid @RequestBody PartCreateRequest request) {
        return new ResponseEntity<>(partService.createPart(request), HttpStatus.CREATED);
    }

    @PutMapping("/parts/{id}")
    @Operation(summary = "Update inventory part item")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<PartDto> updatePart(@PathVariable Long id, @Valid @RequestBody PartCreateRequest request) {
        return ResponseEntity.ok(partService.updatePart(id, request));
    }

    @DeleteMapping("/parts/{id}")
    @Operation(summary = "Delete inventory part item")
    @PreAuthorize("hasAnyRole('MANAGER')")
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/work-orders/{workOrderId}/parts")
    @Operation(summary = "Log parts usage on a work order and deduct inventory stock")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<PartUsageDto> logPartUsage(
            @PathVariable Long workOrderId,
            @Valid @RequestBody PartUsageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return new ResponseEntity<>(partService.logPartUsage(workOrderId, request, userDetails.getUsername()), HttpStatus.CREATED);
    }

    @GetMapping("/work-orders/{workOrderId}/parts")
    @Operation(summary = "Get all parts logged on a work order")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PartUsageDto>> getPartUsageForWorkOrder(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(partService.getPartUsageForWorkOrder(workOrderId));
    }
}
