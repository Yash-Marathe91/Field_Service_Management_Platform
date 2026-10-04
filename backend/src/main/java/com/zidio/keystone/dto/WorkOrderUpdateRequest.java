package com.zidio.keystone.dto;

import com.zidio.keystone.domain.Priority;

public class WorkOrderUpdateRequest {

    private String title;
    private String description;
    private Priority priority;
    private Long assignedTechId;

    public WorkOrderUpdateRequest() {}

    public WorkOrderUpdateRequest(String title, String description, Priority priority, Long assignedTechId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.assignedTechId = assignedTechId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Long getAssignedTechId() { return assignedTechId; }
    public void setAssignedTechId(Long assignedTechId) { this.assignedTechId = assignedTechId; }
}
