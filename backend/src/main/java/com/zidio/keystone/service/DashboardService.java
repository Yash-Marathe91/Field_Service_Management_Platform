package com.zidio.keystone.service;

import com.zidio.keystone.domain.Priority;
import com.zidio.keystone.domain.Role;
import com.zidio.keystone.domain.User;
import com.zidio.keystone.domain.WorkOrder;
import com.zidio.keystone.domain.WorkOrderStatus;
import com.zidio.keystone.dto.DashboardMetricsDto;
import com.zidio.keystone.repository.UserRepository;
import com.zidio.keystone.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final WorkOrderRepository workOrderRepository;
    private final UserRepository userRepository;

    public DashboardService(WorkOrderRepository workOrderRepository, UserRepository userRepository) {
        this.workOrderRepository = workOrderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDto getMetrics() {
        List<WorkOrder> allOrders = workOrderRepository.findAll();

        long total = allOrders.size();
        long active = allOrders.stream()
                .filter(w -> w.getStatus() != WorkOrderStatus.COMPLETED && w.getStatus() != WorkOrderStatus.CANCELLED)
                .count();
        long completed = allOrders.stream()
                .filter(w -> w.getStatus() == WorkOrderStatus.COMPLETED)
                .count();
        long breached = allOrders.stream()
                .filter(w -> Boolean.TRUE.equals(w.getSlaBreached()))
                .count();

        BigDecimal totalPartsCost = allOrders.stream()
                .map(w -> w.getTotalPartsCost() != null ? w.getTotalPartsCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (acc, c) -> acc.add(c));

        long totalLaborMins = allOrders.stream()
                .mapToInt(w -> w.getTotalLaborMinutes() != null ? w.getTotalLaborMinutes() : 0)
                .sum();

        // Status Breakdown Map
        Map<WorkOrderStatus, Long> statusMap = new EnumMap<>(WorkOrderStatus.class);
        for (WorkOrderStatus s : WorkOrderStatus.values()) {
            statusMap.put(s, 0L);
        }
        for (WorkOrder w : allOrders) {
            statusMap.put(w.getStatus(), statusMap.getOrDefault(w.getStatus(), 0L) + 1);
        }

        // Priority Breakdown Map
        Map<Priority, Long> priorityMap = new EnumMap<>(Priority.class);
        for (Priority p : Priority.values()) {
            priorityMap.put(p, 0L);
        }
        for (WorkOrder w : allOrders) {
            priorityMap.put(w.getPriority(), priorityMap.getOrDefault(w.getPriority(), 0L) + 1);
        }

        // Technician Workload
        List<User> technicians = userRepository.findByRole(Role.TECHNICIAN);
        List<DashboardMetricsDto.TechnicianWorkloadDto> techWorkloads = technicians.stream()
                .map(tech -> {
                    long activeAssigned = allOrders.stream()
                            .filter(w -> w.getAssignedTech() != null && w.getAssignedTech().getId().equals(tech.getId()))
                            .filter(w -> w.getStatus() != WorkOrderStatus.COMPLETED && w.getStatus() != WorkOrderStatus.CANCELLED)
                            .count();
                    return new DashboardMetricsDto.TechnicianWorkloadDto(
                            tech.getId(),
                            tech.getFullName(),
                            tech.getEmail(),
                            activeAssigned
                    );
                })
                .collect(Collectors.toList());

        return new DashboardMetricsDto(
                total,
                active,
                completed,
                breached,
                totalPartsCost,
                totalLaborMins,
                statusMap,
                priorityMap,
                techWorkloads
        );
    }
}
