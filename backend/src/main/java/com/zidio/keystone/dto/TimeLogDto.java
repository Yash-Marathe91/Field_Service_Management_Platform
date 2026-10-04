package com.zidio.keystone.dto;

import java.time.LocalDateTime;

public class TimeLogDto {

    private Long id;
    private Long workOrderId;
    private Long technicianId;
    private String technicianName;
    private Integer minutes;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String workDescription;
    private LocalDateTime createdAt;

    public TimeLogDto() {}

    public TimeLogDto(Long id, Long workOrderId, Long technicianId, String technicianName, Integer minutes, LocalDateTime startTime, LocalDateTime endTime, String workDescription, LocalDateTime createdAt) {
        this.id = id;
        this.workOrderId = workOrderId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.minutes = minutes;
        this.startTime = startTime;
        this.endTime = endTime;
        this.workDescription = workDescription;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(Long workOrderId) { this.workOrderId = workOrderId; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public Integer getMinutes() { return minutes; }
    public void setMinutes(Integer minutes) { this.minutes = minutes; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getWorkDescription() { return workDescription; }
    public void setWorkDescription(String workDescription) { this.workDescription = workDescription; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
