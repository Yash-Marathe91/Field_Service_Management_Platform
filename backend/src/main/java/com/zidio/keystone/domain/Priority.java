package com.zidio.keystone.domain;

public enum Priority {
    LOW(168),     // 7 days SLA
    MEDIUM(72),    // 3 days SLA
    HIGH(24),      // 24 hours SLA
    CRITICAL(4);   // 4 hours SLA

    private final int slaHours;

    Priority(int slaHours) {
        this.slaHours = slaHours;
    }

    public int getSlaHours() {
        return slaHours;
    }
}
