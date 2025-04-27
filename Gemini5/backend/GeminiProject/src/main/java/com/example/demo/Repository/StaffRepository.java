package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Staff;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByUsername(String username);

    @Query("SELECT s.staffId FROM Staff s ORDER BY s.staffId DESC LIMIT 1")
    Optional<String> findMaxStaffId();

    @Query("SELECT s FROM Staff s")
    List<Staff> getAllStaff();

    @Query("SELECT s FROM Staff s WHERE s.staffId = ?1")
    Optional<Staff> getStaffById(String id);
}