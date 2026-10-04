package com.zidio.keystone.service;

import com.zidio.keystone.domain.WorkOrder;
import com.zidio.keystone.domain.WorkOrderStatus;
import com.zidio.keystone.repository.WorkOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class SlaTrackingScheduler {

    private static final Logger log = LoggerFactory.getLogger(SlaTrackingScheduler.class);

    private final WorkOrderRepository workOrderRepository;

    public SlaTrackingScheduler(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    /**
     * Checks uncompleted work orders every 60 seconds and flags SLA breaches.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndFlagSlaBreaches() {
        OffsetDateTime now = OffsetDateTime.now();
        List<WorkOrder> activeOrders = workOrderRepository.findAll().stream()
                .filter(w -> w.getStatus() != WorkOrderStatus.COMPLETED && w.getStatus() != WorkOrderStatus.CANCELLED)
                .filter(w -> !Boolean.TRUE.equals(w.getSlaBreached()))
                .filter(w -> w.getSlaDueDate() != null && w.getSlaDueDate().isBefore(now))
                .toList();

        if (!activeOrders.isEmpty()) {
            log.warn("SLA Scheduler: Found {} work orders breaching SLA guarantees. Updating breach flag...", activeOrders.size());
            for (WorkOrder order : activeOrders) {
                order.setSlaBreached(true);
                workOrderRepository.save(order);
                log.info("SLA BREACH DETECTED for Work Order: {}", order.getCode());
            }
        }
    }
}
