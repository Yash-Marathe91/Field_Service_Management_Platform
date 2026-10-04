package com.zidio.keystone.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class TimeLogCreateRequest {

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer minutes;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String workDescription;

    public TimeLogCreateRequest() {}

    public TimeLogCreateRequest(Integer minutes, LocalDateTime startTime, LocalDateTime endTime, String workDescription) {
        this.minutes = minutes;
        this.startTime = startTime;
        this.endTime = endTime;
        this.workDescription = workDescription;
    }

    public Integer getMinutes() { return minutes; }
    public void setMinutes(Integer minutes) { this.minutes = minutes; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getWorkDescription() { return workDescription; }
    public void setWorkDescription(String workDescription) { this.workDescription = workDescription; }
}
