package com.zidio.keystone.controller;

import com.zidio.keystone.domain.Role;
import com.zidio.keystone.dto.UserDto;
import com.zidio.keystone.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Endpoints for User and Staff Management")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasAnyRole('MANAGER', 'DISPATCHER')")
    @Operation(summary = "List Technicians", description = "Returns active technicians available for work order assignment.")
    public ResponseEntity<List<UserDto>> getTechnicians() {
        List<UserDto> technicians = userRepository.findByRole(Role.TECHNICIAN).stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getEmail(),
                        u.getFullName(),
                        u.getRole(),
                        u.getPhone(),
                        null,
                        null
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(technicians);
    }
}
