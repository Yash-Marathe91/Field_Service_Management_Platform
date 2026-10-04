package com.zidio.keystone.dto;

import com.zidio.keystone.domain.Priority;
import com.zidio.keystone.domain.WorkOrderStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public class WorkOrderDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Priority priority;
    private WorkOrderStatus status;
    
    private Long customerId;
    private String customerName;
    
    private Long siteId;
    private String siteName;
    private String siteAddress;
    
    private Long assignedTechId;
    private String assignedTechName;
    
    private Long creatorId;
    private String creatorName;

    private OffsetDateTime slaDueDate;
    private Boolean slaBreached;
    private BigDecimal totalPartsCost;
    private Integer totalLaborMinutes;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    private List<WorkOrderStatusHistoryDto> history;

    public WorkOrderDto() {}

    public WorkOrderDto(Long id, String code, String title, String description, Priority priority, WorkOrderStatus status, Long customerId, String customerName, Long siteId, String siteName, String siteAddress, Long assignedTechId, String assignedTechName, Long creatorId, String creatorName, OffsetDateTime slaDueDate, Boolean slaBreached, BigDecimal totalPartsCost, Integer totalLaborMinutes, OffsetDateTime createdAt, OffsetDateTime updatedAt, List<WorkOrderStatusHistoryDto> history) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.customerId = customerId;
        this.customerName = customerName;
        this.siteId = siteId;
        this.siteName = siteName;
        this.siteAddress = siteAddress;
        this.assignedTechId = assignedTechId;
        this.assignedTechName = assignedTechName;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.slaDueDate = slaDueDate;
        this.slaBreached = slaBreached;
        this.totalPartsCost = totalPartsCost;
        this.totalLaborMinutes = totalLaborMinutes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.history = history;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public WorkOrderStatus getStatus() { return status; }
    public void setStatus(WorkOrderStatus status) { this.status = status; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getSiteId() { return siteId; }
    public void setSiteId(Long siteId) { this.siteId = siteId; }

    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }

    public String getSiteAddress() { return siteAddress; }
    public void setSiteAddress(String siteAddress) { this.siteAddress = siteAddress; }

    public Long getAssignedTechId() { return assignedTechId; }
    public void setAssignedTechId(Long assignedTechId) { this.assignedTechId = assignedTechId; }

    public String getAssignedTechName() { return assignedTechName; }
    public void setAssignedTechName(String assignedTechName) { this.assignedTechName = assignedTechName; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public OffsetDateTime getSlaDueDate() { return slaDueDate; }
    public void setSlaDueDate(OffsetDateTime slaDueDate) { this.slaDueDate = slaDueDate; }

    public Boolean getSlaBreached() { return slaBreached; }
    public void setSlaBreached(Boolean slaBreached) { this.slaBreached = slaBreached; }

    public BigDecimal getTotalPartsCost() { return totalPartsCost; }
    public void setTotalPartsCost(BigDecimal totalPartsCost) { this.totalPartsCost = totalPartsCost; }

    public Integer getTotalLaborMinutes() { return totalLaborMinutes; }
    public void setTotalLaborMinutes(Integer totalLaborMinutes) { this.totalLaborMinutes = totalLaborMinutes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<WorkOrderStatusHistoryDto> getHistory() { return history; }
    public void setHistory(List<WorkOrderStatusHistoryDto> history) { this.history = history; }
}
