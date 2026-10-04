package com.zidio.keystone.controller;

import com.zidio.keystone.domain.WorkOrderStatus;
import com.zidio.keystone.dto.WorkOrderCreateRequest;
import com.zidio.keystone.dto.WorkOrderDto;
import com.zidio.keystone.dto.WorkOrderUpdateRequest;
import com.zidio.keystone.security.CustomUserDetails;
import com.zidio.keystone.service.WorkOrderService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/work-orders")
@Tag(name = "Work Orders", description = "Endpoints for Work Order Lifecycle, Dispatch, and Status Management")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @PostMapping
    @Operation(summary = "Create Work Order", description = "Generates a new work order with calculated SLA due date.")
    public ResponseEntity<WorkOrderDto> createWorkOrder(
            @Valid @RequestBody WorkOrderCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        WorkOrderDto created = workOrderService.createWorkOrder(request, currentUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List Work Orders", description = "Returns a filterable, role-scoped, paginated list of work orders.")
    public ResponseEntity<Page<WorkOrderDto>> getWorkOrders(
            @RequestParam(required = false) WorkOrderStatus status,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long techId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<WorkOrderDto> workOrders = workOrderService.getWorkOrders(status, customerId, techId, search, currentUser, pageable);
        return ResponseEntity.ok(workOrders);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Work Order Details", description = "Fetches complete work order details including status transition history.")
    public ResponseEntity<WorkOrderDto> getWorkOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        WorkOrderDto workOrder = workOrderService.getWorkOrderById(id, currentUser);
        return ResponseEntity.ok(workOrder);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Work Order", description = "Edits work order details or assigns a technician while open.")
    public ResponseEntity<WorkOrderDto> updateWorkOrder(
            @PathVariable Long id,
            @RequestBody WorkOrderUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        WorkOrderDto updated = workOrderService.updateWorkOrder(id, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Work Order")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    public ResponseEntity<Void> deleteWorkOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        workOrderService.deleteWorkOrder(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Transition Work Order Status", description = "Advances work order through state machine (NEW -> ASSIGNED -> IN_PROGRESS -> COMPLETED).")
    public ResponseEntity<WorkOrderDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        String statusStr = payload.get("status");
        String notes = payload.get("notes");
        if (statusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        WorkOrderStatus newStatus = WorkOrderStatus.valueOf(statusStr.toUpperCase());
        WorkOrderDto updated = workOrderService.updateWorkOrderStatus(id, newStatus, notes, currentUser);
        return ResponseEntity.ok(updated);
    }
}
