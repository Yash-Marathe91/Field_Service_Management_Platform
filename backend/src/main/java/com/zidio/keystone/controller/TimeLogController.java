package com.zidio.keystone.controller;

import com.zidio.keystone.dto.TimeLogCreateRequest;
import com.zidio.keystone.dto.TimeLogDto;
import com.zidio.keystone.service.TimeLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders/{workOrderId}/time-logs")
@Tag(name = "Labor Time Logging", description = "Endpoints for logging field technician labor duration")
public class TimeLogController {

    private final TimeLogService timeLogService;

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @PostMapping
    @Operation(summary = "Log technician labor hours/minutes on a work order")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER', 'TECHNICIAN')")
    public ResponseEntity<TimeLogDto> logTime(
            @PathVariable Long workOrderId,
            @Valid @RequestBody TimeLogCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return new ResponseEntity<>(timeLogService.logTime(workOrderId, request, userDetails.getUsername()), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all labor time logs recorded for a work order")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TimeLogDto>> getTimeLogsForWorkOrder(@PathVariable Long workOrderId) {
        return ResponseEntity.ok(timeLogService.getTimeLogsForWorkOrder(workOrderId));
    }
}
