package com.zidio.keystone.dto;

import com.zidio.keystone.domain.WorkOrderStatus;
import java.time.OffsetDateTime;

public class WorkOrderStatusHistoryDto {
    private Long id;
    private WorkOrderStatus fromStatus;
    private WorkOrderStatus toStatus;
    private Long changedById;
    private String changedByName;
    private OffsetDateTime changedAt;
    private String notes;

    public WorkOrderStatusHistoryDto() {}

    public WorkOrderStatusHistoryDto(Long id, WorkOrderStatus fromStatus, WorkOrderStatus toStatus, Long changedById, String changedByName, OffsetDateTime changedAt, String notes) {
        this.id = id;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedById = changedById;
        this.changedByName = changedByName;
        this.changedAt = changedAt;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WorkOrderStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(WorkOrderStatus fromStatus) { this.fromStatus = fromStatus; }

    public WorkOrderStatus getToStatus() { return toStatus; }
    public void setToStatus(WorkOrderStatus toStatus) { this.toStatus = toStatus; }

    public Long getChangedById() { return changedById; }
    public void setChangedById(Long changedById) { this.changedById = changedById; }

    public String getChangedByName() { return changedByName; }
    public void setChangedByName(String changedByName) { this.changedByName = changedByName; }

    public OffsetDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(OffsetDateTime changedAt) { this.changedAt = changedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
