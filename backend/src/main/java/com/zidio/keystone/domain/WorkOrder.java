package com.zidio.keystone.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "work_orders")
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkOrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_tech_id")
    private User assignedTech;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column(name = "sla_due_date", nullable = false)
    private OffsetDateTime slaDueDate;

    @Column(name = "sla_breached", nullable = false)
    private Boolean slaBreached;

    @Column(name = "total_parts_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPartsCost;

    @Column(name = "total_labor_minutes", nullable = false)
    private Integer totalLaborMinutes;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public WorkOrder() {}

    public WorkOrder(Long id, String code, String title, String description, Priority priority, WorkOrderStatus status, Customer customer, Site site, User assignedTech, User creator, OffsetDateTime slaDueDate, Boolean slaBreached, BigDecimal totalPartsCost, Integer totalLaborMinutes, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.customer = customer;
        this.site = site;
        this.assignedTech = assignedTech;
        this.creator = creator;
        this.slaDueDate = slaDueDate;
        this.slaBreached = slaBreached;
        this.totalPartsCost = totalPartsCost;
        this.totalLaborMinutes = totalLaborMinutes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
        if (slaBreached == null) slaBreached = false;
        if (totalPartsCost == null) totalPartsCost = BigDecimal.ZERO;
        if (totalLaborMinutes == null) totalLaborMinutes = 0;
        if (status == null) status = WorkOrderStatus.NEW;
        if (priority == null) priority = Priority.MEDIUM;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
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

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Site getSite() { return site; }
    public void setSite(Site site) { this.site = site; }

    public User getAssignedTech() { return assignedTech; }
    public void setAssignedTech(User assignedTech) { this.assignedTech = assignedTech; }

    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }

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
}
