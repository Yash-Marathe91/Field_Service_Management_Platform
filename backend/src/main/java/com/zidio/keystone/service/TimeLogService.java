package com.zidio.keystone.service;

import com.zidio.keystone.domain.TimeLog;
import com.zidio.keystone.domain.User;
import com.zidio.keystone.domain.WorkOrder;
import com.zidio.keystone.dto.TimeLogCreateRequest;
import com.zidio.keystone.dto.TimeLogDto;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.repository.TimeLogRepository;
import com.zidio.keystone.repository.UserRepository;
import com.zidio.keystone.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;
    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    public TimeLogService(TimeLogRepository timeLogRepository, WorkOrderRepository workOrderRepository, UserRepository userRepository) {
        this.timeLogRepository = timeLogRepository;
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TimeLogDto logTime(Long workOrderId, TimeLogCreateRequest request, String technicianEmail) {
        Long safeId = Objects.requireNonNull(workOrderId, "Work Order ID must not be null");
        WorkOrder workOrder = workOrderRepository.findById(safeId)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + safeId));

        User tech = userRepository.findByEmail(technicianEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found: " + technicianEmail));

        TimeLog timeLog = new TimeLog(
                workOrder,
                tech,
                request.getMinutes(),
                request.getWorkDescription()
        );

        TimeLog savedLog = timeLogRepository.save(timeLog);

        // Accumulate work order labor minutes
        int currentMinutes = workOrder.getTotalLaborMinutes() != null ? workOrder.getTotalLaborMinutes() : 0;
        workOrder.setTotalLaborMinutes(currentMinutes + request.getMinutes());
        workOrderRepository.save(workOrder);

        return mapToDto(savedLog);
    }

    @Transactional(readOnly = true)
    public List<TimeLogDto> getTimeLogsForWorkOrder(Long workOrderId) {
        Long safeId = Objects.requireNonNull(workOrderId, "Work Order ID must not be null");
        return timeLogRepository.findByWorkOrderId(safeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private TimeLogDto mapToDto(TimeLog log) {
        return new TimeLogDto(
                log.getId(),
                log.getWorkOrder().getId(),
                log.getTechnician().getId(),
                log.getTechnician().getFullName(),
                log.getMinutesSpent(),
                log.getLoggedAt() != null ? log.getLoggedAt().toLocalDateTime() : null,
                log.getLoggedAt() != null ? log.getLoggedAt().toLocalDateTime() : null,
                log.getNote(),
                log.getLoggedAt() != null ? log.getLoggedAt().toLocalDateTime() : null
        );
    }
}
