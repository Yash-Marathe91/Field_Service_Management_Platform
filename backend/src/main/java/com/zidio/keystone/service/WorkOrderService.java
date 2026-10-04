package com.zidio.keystone.service;

import com.zidio.keystone.domain.*;
import com.zidio.keystone.dto.*;
import com.zidio.keystone.exception.InvalidStateTransitionException;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.exception.UnauthorizedAccessException;
import com.zidio.keystone.repository.*;
import com.zidio.keystone.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final WorkOrderStatusHistoryRepository historyRepository;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            CustomerRepository customerRepository,
            SiteRepository siteRepository,
            UserRepository userRepository,
            WorkOrderStatusHistoryRepository historyRepository) {
        this.workOrderRepository = workOrderRepository;
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public WorkOrderDto createWorkOrder(WorkOrderCreateRequest request, CustomUserDetails currentUser) {
        Long customerId = Objects.requireNonNull(request.getCustomerId(), "Customer ID must not be null");
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        if ("CUSTOMER".equals(currentUser.getRole()) && !customerId.equals(currentUser.getCustomerId())) {
            throw new UnauthorizedAccessException("Customers can only create work orders for their own account");
        }

        Long siteId = Objects.requireNonNull(request.getSiteId(), "Site ID must not be null");
        Site site = siteRepository.findById(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found with id: " + siteId));

        if (!site.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Site does not belong to the specified customer");
        }

        Long creatorId = Objects.requireNonNull(currentUser.getId(), "Creator ID must not be null");
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator user not found"));

        User assignedTech = null;
        if (request.getAssignedTechId() != null) {
            Long techId = Objects.requireNonNull(request.getAssignedTechId(), "Tech ID must not be null");
            assignedTech = userRepository.findById(techId)
                    .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + techId));
            if (assignedTech.getRole() != Role.TECHNICIAN) {
                throw new IllegalArgumentException("Assigned user must have TECHNICIAN role");
            }
        }

        WorkOrder workOrder = new WorkOrder();
        workOrder.setCode(generateUniqueCode());
        workOrder.setTitle(request.getTitle());
        workOrder.setDescription(request.getDescription());
        workOrder.setPriority(request.getPriority());
        workOrder.setStatus(assignedTech != null ? WorkOrderStatus.ASSIGNED : WorkOrderStatus.NEW);
        workOrder.setCustomer(customer);
        workOrder.setSite(site);
        workOrder.setCreator(creator);
        workOrder.setAssignedTech(assignedTech);

        OffsetDateTime now = OffsetDateTime.now();
        workOrder.setSlaDueDate(now.plusHours(request.getPriority().getSlaHours()));
        workOrder.setSlaBreached(false);
        workOrder.setTotalPartsCost(BigDecimal.ZERO);
        workOrder.setTotalLaborMinutes(0);

        WorkOrder saved = workOrderRepository.save(workOrder);

        recordStatusHistory(saved, null, saved.getStatus(), creator, "Work order created");

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<WorkOrderDto> getWorkOrders(
            WorkOrderStatus status,
            Long customerId,
            Long techId,
            String search,
            CustomUserDetails currentUser,
            Pageable pageable) {

        if ("CUSTOMER".equals(currentUser.getRole())) {
            customerId = currentUser.getCustomerId();
        } else if ("TECHNICIAN".equals(currentUser.getRole())) {
            techId = currentUser.getId();
        }

        String searchPattern = (search != null && !search.trim().isEmpty()) ? "%" + search.trim().toLowerCase() + "%" : null;

        Page<WorkOrder> page = workOrderRepository.findFilteredWorkOrders(
                status, customerId, techId, searchPattern, pageable
        );

        return page.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public WorkOrderDto getWorkOrderById(Long id, CustomUserDetails currentUser) {
        Long safeId = Objects.requireNonNull(id, "Work Order ID must not be null");
        WorkOrder workOrder = workOrderRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + safeId));

        if ("CUSTOMER".equals(currentUser.getRole()) && !workOrder.getCustomer().getId().equals(currentUser.getCustomerId())) {
            throw new UnauthorizedAccessException("You do not have permission to access this work order");
        }

        return mapToDto(workOrder);
    }

    @Transactional
    public WorkOrderDto updateWorkOrder(Long id, WorkOrderUpdateRequest request, CustomUserDetails currentUser) {
        Long safeId = Objects.requireNonNull(id, "Work Order ID must not be null");
        WorkOrder workOrder = workOrderRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + safeId));

        if (workOrder.getStatus().isTerminal()) {
            throw new InvalidStateTransitionException("Work order " + workOrder.getCode() + " is in terminal state " + workOrder.getStatus() + " and cannot be modified.");
        }

        if (request.getTitle() != null) workOrder.setTitle(request.getTitle());
        if (request.getDescription() != null) workOrder.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            workOrder.setPriority(request.getPriority());
            workOrder.setSlaDueDate(workOrder.getCreatedAt().plusHours(request.getPriority().getSlaHours()));
        }

        if (request.getAssignedTechId() != null) {
            Long techId = Objects.requireNonNull(request.getAssignedTechId(), "Tech ID must not be null");
            User tech = userRepository.findById(techId)
                    .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + techId));
            workOrder.setAssignedTech(tech);
            if (workOrder.getStatus() == WorkOrderStatus.NEW) {
                WorkOrderStatus oldStatus = workOrder.getStatus();
                workOrder.setStatus(WorkOrderStatus.ASSIGNED);
                Long currentUserId = Objects.requireNonNull(currentUser.getId(), "User ID must not be null");
                User user = userRepository.findById(currentUserId).orElseThrow();
                recordStatusHistory(workOrder, oldStatus, WorkOrderStatus.ASSIGNED, user, "Assigned to technician " + tech.getFullName());
            }
        }

        WorkOrder updated = workOrderRepository.save(workOrder);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteWorkOrder(Long id, CustomUserDetails currentUser) {
        Long safeId = Objects.requireNonNull(id, "Work Order ID must not be null");
        WorkOrder workOrder = workOrderRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + safeId));
        if ("CUSTOMER".equals(currentUser.getRole()) && !workOrder.getCustomer().getId().equals(currentUser.getCustomerId())) {
            throw new UnauthorizedAccessException("You do not have permission to delete this work order");
        }
        workOrderRepository.delete(workOrder);
    }

    @Transactional
    public WorkOrderDto updateWorkOrderStatus(Long id, WorkOrderStatus newStatus, String notes, CustomUserDetails currentUser) {
        Long safeId = Objects.requireNonNull(id, "Work Order ID must not be null");
        WorkOrder workOrder = workOrderRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + safeId));

        WorkOrderStatus currentStatus = workOrder.getStatus();

        if (currentStatus == newStatus) {
            return mapToDto(workOrder);
        }

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new InvalidStateTransitionException("Illegal status transition from " + currentStatus + " to " + newStatus);
        }

        Long currentUserId = Objects.requireNonNull(currentUser.getId(), "User ID must not be null");
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        workOrder.setStatus(newStatus);
        WorkOrder saved = workOrderRepository.save(workOrder);

        recordStatusHistory(saved, currentStatus, newStatus, user, notes);

        return mapToDto(saved);
    }

    private boolean isValidTransition(WorkOrderStatus current, WorkOrderStatus target) {
        if (current.isTerminal()) return false;
        return switch (current) {
            case NEW -> target == WorkOrderStatus.ASSIGNED || target == WorkOrderStatus.CANCELLED;
            case ASSIGNED -> target == WorkOrderStatus.IN_PROGRESS || target == WorkOrderStatus.CANCELLED;
            case IN_PROGRESS -> target == WorkOrderStatus.ON_HOLD || target == WorkOrderStatus.COMPLETED || target == WorkOrderStatus.CANCELLED;
            case ON_HOLD -> target == WorkOrderStatus.IN_PROGRESS || target == WorkOrderStatus.CANCELLED;
            default -> false;
        };
    }

    private void recordStatusHistory(WorkOrder workOrder, WorkOrderStatus from, WorkOrderStatus to, User user, String notes) {
        WorkOrderStatusHistory history = new WorkOrderStatusHistory();
        history.setWorkOrder(workOrder);
        history.setFromStatus(from);
        history.setToStatus(to);
        history.setChangedBy(user);
        history.setNotes(notes);
        historyRepository.save(history);
    }

    private String generateUniqueCode() {
        long count = workOrderRepository.count() + 1;
        int year = OffsetDateTime.now().getYear();
        return String.format("WO-%d-%04d", year, count);
    }

    public WorkOrderDto mapToDto(WorkOrder wo) {
        if (wo == null) return null;

        List<WorkOrderStatusHistoryDto> historyDtos = historyRepository.findByWorkOrderIdOrderByChangedAtAsc(wo.getId())
                .stream()
                .map(h -> new WorkOrderStatusHistoryDto(
                        h.getId(),
                        h.getFromStatus(),
                        h.getToStatus(),
                        h.getChangedBy().getId(),
                        h.getChangedBy().getFullName(),
                        h.getChangedAt(),
                        h.getNotes()
                ))
                .collect(Collectors.toList());

        return new WorkOrderDto(
                wo.getId(),
                wo.getCode(),
                wo.getTitle(),
                wo.getDescription(),
                wo.getPriority(),
                wo.getStatus(),
                wo.getCustomer().getId(),
                wo.getCustomer().getName(),
                wo.getSite().getId(),
                wo.getSite().getName(),
                wo.getSite().getAddress(),
                wo.getAssignedTech() != null ? wo.getAssignedTech().getId() : null,
                wo.getAssignedTech() != null ? wo.getAssignedTech().getFullName() : null,
                wo.getCreator() != null ? wo.getCreator().getId() : null,
                wo.getCreator() != null ? wo.getCreator().getFullName() : null,
                wo.getSlaDueDate(),
                wo.getSlaBreached(),
                wo.getTotalPartsCost(),
                wo.getTotalLaborMinutes(),
                wo.getCreatedAt(),
                wo.getUpdatedAt(),
                historyDtos
        );
    }
}
