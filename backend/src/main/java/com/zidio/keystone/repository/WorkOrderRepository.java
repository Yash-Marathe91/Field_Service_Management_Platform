package com.zidio.keystone.repository;

import com.zidio.keystone.domain.WorkOrder;
import com.zidio.keystone.domain.WorkOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    Page<WorkOrder> findByAssignedTechId(Long techId, Pageable pageable);

    Page<WorkOrder> findByCustomerId(Long customerId, Pageable pageable);

    @Query("SELECT w FROM WorkOrder w WHERE " +
           "(:status IS NULL OR w.status = :status) AND " +
           "(:customerId IS NULL OR w.customer.id = :customerId) AND " +
           "(:techId IS NULL OR w.assignedTech.id = :techId) AND " +
           "(:search IS NULL OR LOWER(w.title) LIKE :search OR LOWER(w.code) LIKE :search)")
    Page<WorkOrder> findFilteredWorkOrders(
            @Param("status") WorkOrderStatus status,
            @Param("customerId") Long customerId,
            @Param("techId") Long techId,
            @Param("search") String search,
            Pageable pageable
    );

    List<WorkOrder> findByStatusNot(WorkOrderStatus status);

    List<WorkOrder> findBySlaDueDateBeforeAndSlaBreachedFalseAndStatusNotIn(
            OffsetDateTime now, List<WorkOrderStatus> terminalStatuses);

    long countByStatus(WorkOrderStatus status);

    long countBySlaBreachedTrue();

    long countBySlaDueDateBeforeAndStatusNotIn(OffsetDateTime now, List<WorkOrderStatus> terminalStatuses);
}
