package com.zidio.keystone.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "time_logs")
public class TimeLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "technician_id", nullable = false)
    private User technician;

    @Column(name = "minutes_spent", nullable = false)
    private Integer minutesSpent;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "logged_at", updatable = false)
    private OffsetDateTime loggedAt;

    public TimeLog() {}

    public TimeLog(WorkOrder workOrder, User technician, Integer minutesSpent, String note) {
        this.workOrder = workOrder;
        this.technician = technician;
        this.minutesSpent = minutesSpent;
        this.note = note;
    }

    public TimeLog(Long id, WorkOrder workOrder, User technician, Integer minutesSpent, String note, OffsetDateTime loggedAt) {
        this.id = id;
        this.workOrder = workOrder;
        this.technician = technician;
        this.minutesSpent = minutesSpent;
        this.note = note;
        this.loggedAt = loggedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (loggedAt == null) loggedAt = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WorkOrder getWorkOrder() { return workOrder; }
    public void setWorkOrder(WorkOrder workOrder) { this.workOrder = workOrder; }

    public User getTechnician() { return technician; }
    public void setTechnician(User technician) { this.technician = technician; }

    public Integer getMinutesSpent() { return minutesSpent; }
    public void setMinutesSpent(Integer minutesSpent) { this.minutesSpent = minutesSpent; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public OffsetDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(OffsetDateTime loggedAt) { this.loggedAt = loggedAt; }
}
