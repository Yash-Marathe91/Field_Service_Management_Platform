package com.zidio.keystone.service;

import com.zidio.keystone.domain.Part;
import com.zidio.keystone.domain.PartUsage;
import com.zidio.keystone.domain.User;
import com.zidio.keystone.domain.WorkOrder;
import com.zidio.keystone.dto.PartCreateRequest;
import com.zidio.keystone.dto.PartDto;
import com.zidio.keystone.dto.PartUsageDto;
import com.zidio.keystone.dto.PartUsageRequest;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.repository.PartRepository;
import com.zidio.keystone.repository.PartUsageRepository;
import com.zidio.keystone.repository.UserRepository;
import com.zidio.keystone.repository.WorkOrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PartService {

    private final PartRepository partRepository;
    private final PartUsageRepository partUsageRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    public PartService(PartRepository partRepository, PartUsageRepository partUsageRepository, WorkOrderRepository workOrderRepository, UserRepository userRepository) {
        this.partRepository = partRepository;
        this.partUsageRepository = partUsageRepository;
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PartDto createPart(PartCreateRequest request) {
        if (partRepository.findBySku(request.getPartNumber()).isPresent()) {
            throw new IllegalArgumentException("Part with SKU/Number " + request.getPartNumber() + " already exists");
        }

        Part part = new Part(
                request.getPartNumber(),
                request.getName(),
                request.getDescription(),
                request.getUnitPrice(),
                request.getQuantityOnHand(),
                request.getMinimumStockLevel() != null ? request.getMinimumStockLevel() : 5
        );

        Part saved = partRepository.save(part);
        return mapToPartDto(saved);
    }

    @Transactional
    public PartDto updatePart(Long id, PartCreateRequest request) {
        Long safeId = Objects.requireNonNull(id, "Part ID must not be null");
        Part part = partRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + safeId));

        if (request.getPartNumber() != null) part.setSku(request.getPartNumber());
        if (request.getName() != null) part.setName(request.getName());
        if (request.getDescription() != null) part.setDescription(request.getDescription());
        if (request.getUnitPrice() != null) part.setUnitPrice(request.getUnitPrice());
        if (request.getQuantityOnHand() != null) part.setStockQuantity(request.getQuantityOnHand());
        if (request.getMinimumStockLevel() != null) part.setMinStockLevel(request.getMinimumStockLevel());

        Part updated = partRepository.save(part);
        return mapToPartDto(updated);
    }

    @Transactional
    public void deletePart(Long id) {
        Long safeId = Objects.requireNonNull(id, "Part ID must not be null");
        if (!partRepository.existsById(safeId)) {
            throw new ResourceNotFoundException("Part not found with id: " + safeId);
        }
        partRepository.deleteById(safeId);
    }

    @Transactional(readOnly = true)
    public Page<PartDto> getParts(String search, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Part> partPage;
        if (search != null && !search.trim().isEmpty()) {
            partPage = partRepository.findFilteredParts(search.trim(), pageable);
        } else {
            partPage = partRepository.findAll(pageable);
        }
        return partPage.map(this::mapToPartDto);
    }

    @Transactional(readOnly = true)
    public PartDto getPartById(Long id) {
        Long safeId = Objects.requireNonNull(id, "Part ID must not be null");
        Part part = partRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + safeId));
        return mapToPartDto(part);
    }

    @Transactional
    public PartUsageDto logPartUsage(Long workOrderId, PartUsageRequest request, String userEmail) {
        Long safeWorkOrderId = Objects.requireNonNull(workOrderId, "Work Order ID must not be null");
        Long safePartId = Objects.requireNonNull(request.getPartId(), "Part ID must not be null");

        WorkOrder workOrder = workOrderRepository.findById(safeWorkOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + safeWorkOrderId));

        Part part = partRepository.findById(safePartId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + safePartId));

        if (part.getStockQuantity() < request.getQuantityUsed()) {
            throw new IllegalArgumentException("Insufficient inventory for part: " + part.getName() + 
                    ". Available: " + part.getStockQuantity() + ", Requested: " + request.getQuantityUsed());
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Deduct inventory
        part.setStockQuantity(part.getStockQuantity() - request.getQuantityUsed());
        partRepository.save(part);

        BigDecimal totalPrice = part.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantityUsed()));

        PartUsage usage = new PartUsage(
                workOrder,
                part,
                request.getQuantityUsed(),
                part.getUnitPrice(),
                totalPrice,
                user
        );
        usage.setNotes(request.getNotes());

        PartUsage savedUsage = partUsageRepository.save(usage);

        // Update Work Order total parts cost
        BigDecimal currentCost = workOrder.getTotalPartsCost() != null ? workOrder.getTotalPartsCost() : BigDecimal.ZERO;
        workOrder.setTotalPartsCost(currentCost.add(totalPrice));
        workOrderRepository.save(workOrder);

        return mapToUsageDto(savedUsage);
    }

    @Transactional(readOnly = true)
    public List<PartUsageDto> getPartUsageForWorkOrder(Long workOrderId) {
        Long safeId = Objects.requireNonNull(workOrderId, "Work Order ID must not be null");
        return partUsageRepository.findByWorkOrderId(safeId).stream()
                .map(this::mapToUsageDto)
                .collect(Collectors.toList());
    }

    private PartDto mapToPartDto(Part part) {
        boolean isLowStock = part.getStockQuantity() <= part.getMinStockLevel();
        return new PartDto(
                part.getId(),
                part.getSku(),
                part.getName(),
                part.getDescription(),
                part.getUnitPrice(),
                part.getStockQuantity(),
                part.getMinStockLevel(),
                isLowStock,
                part.getCreatedAt() != null ? part.getCreatedAt().toLocalDateTime() : null
        );
    }

    private PartUsageDto mapToUsageDto(PartUsage usage) {
        return new PartUsageDto(
                usage.getId(),
                usage.getWorkOrder().getId(),
                usage.getPart().getId(),
                usage.getPart().getSku(),
                usage.getPart().getName(),
                usage.getQuantity(),
                usage.getUnitPrice(),
                usage.getTotalPrice(),
                usage.getLoggedBy() != null ? usage.getLoggedBy().getFullName() : "System",
                usage.getCreatedAt() != null ? usage.getCreatedAt().toLocalDateTime() : null,
                usage.getNotes()
        );
    }
}
