package com.zidio.keystone.repository;

import com.zidio.keystone.domain.Site;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
    List<Site> findByCustomerId(Long customerId);
    Page<Site> findByCustomerId(Long customerId, Pageable pageable);
    Page<Site> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
