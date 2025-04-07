package com.example.GeminiProject.Repository;

import com.example.GeminiProject.Model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, String> {
    Optional<Staff> findByUsername(String username);

    @Query("SELECT s.staffId FROM Staff s ORDER BY s.staffId DESC LIMIT 1")
    Optional<String> findMaxStaffId();

    @Query("SELECT s FROM Staff s")
    List<Staff> getAllStaff();
}
