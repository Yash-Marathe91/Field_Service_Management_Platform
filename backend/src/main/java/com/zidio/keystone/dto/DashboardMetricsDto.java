package com.zidio.keystone.dto;

import com.zidio.keystone.domain.Priority;
import com.zidio.keystone.domain.WorkOrderStatus;

import java.math.BigDecimal;
import java.util.Map;
import java.util.List;

public class DashboardMetricsDto {

    private long totalWorkOrders;
    private long activeWorkOrders;
    private long completedWorkOrders;
    private long slaBreachedOrders;
    private BigDecimal totalPartsCostAllTime;
    private long totalLaborMinutesAllTime;
    private Map<WorkOrderStatus, Long> statusBreakdown;
    private Map<Priority, Long> priorityBreakdown;
    private List<TechnicianWorkloadDto> technicianWorkload;

    public DashboardMetricsDto() {}

    public DashboardMetricsDto(long totalWorkOrders, long activeWorkOrders, long completedWorkOrders, long slaBreachedOrders, BigDecimal totalPartsCostAllTime, long totalLaborMinutesAllTime, Map<WorkOrderStatus, Long> statusBreakdown, Map<Priority, Long> priorityBreakdown, List<TechnicianWorkloadDto> technicianWorkload) {
        this.totalWorkOrders = totalWorkOrders;
        this.activeWorkOrders = activeWorkOrders;
        this.completedWorkOrders = completedWorkOrders;
        this.slaBreachedOrders = slaBreachedOrders;
        this.totalPartsCostAllTime = totalPartsCostAllTime;
        this.totalLaborMinutesAllTime = totalLaborMinutesAllTime;
        this.statusBreakdown = statusBreakdown;
        this.priorityBreakdown = priorityBreakdown;
        this.technicianWorkload = technicianWorkload;
    }

    public long getTotalWorkOrders() { return totalWorkOrders; }
    public void setTotalWorkOrders(long totalWorkOrders) { this.totalWorkOrders = totalWorkOrders; }

    public long getActiveWorkOrders() { return activeWorkOrders; }
    public void setActiveWorkOrders(long activeWorkOrders) { this.activeWorkOrders = activeWorkOrders; }

    public long getCompletedWorkOrders() { return completedWorkOrders; }
    public void setCompletedWorkOrders(long completedWorkOrders) { this.completedWorkOrders = completedWorkOrders; }

    public long getSlaBreachedOrders() { return slaBreachedOrders; }
    public void setSlaBreachedOrders(long slaBreachedOrders) { this.slaBreachedOrders = slaBreachedOrders; }

    public BigDecimal getTotalPartsCostAllTime() { return totalPartsCostAllTime; }
    public void setTotalPartsCostAllTime(BigDecimal totalPartsCostAllTime) { this.totalPartsCostAllTime = totalPartsCostAllTime; }

    public long getTotalLaborMinutesAllTime() { return totalLaborMinutesAllTime; }
    public void setTotalLaborMinutesAllTime(long totalLaborMinutesAllTime) { this.totalLaborMinutesAllTime = totalLaborMinutesAllTime; }

    public Map<WorkOrderStatus, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<WorkOrderStatus, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public Map<Priority, Long> getPriorityBreakdown() { return priorityBreakdown; }
    public void setPriorityBreakdown(Map<Priority, Long> priorityBreakdown) { this.priorityBreakdown = priorityBreakdown; }

    public List<TechnicianWorkloadDto> getTechnicianWorkload() { return technicianWorkload; }
    public void setTechnicianWorkload(List<TechnicianWorkloadDto> technicianWorkload) { this.technicianWorkload = technicianWorkload; }

    public static class TechnicianWorkloadDto {
        private Long id;
        private String name;
        private String email;
        private long activeAssignedOrders;

        public TechnicianWorkloadDto() {}

        public TechnicianWorkloadDto(Long id, String name, String email, long activeAssignedOrders) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.activeAssignedOrders = activeAssignedOrders;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public long getActiveAssignedOrders() { return activeAssignedOrders; }
        public void setActiveAssignedOrders(long activeAssignedOrders) { this.activeAssignedOrders = activeAssignedOrders; }
    }
}
