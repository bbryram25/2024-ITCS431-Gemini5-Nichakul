package com.example.GeminiProject.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.GeminiProject.Model.DataProcessing;

public interface DataProcessingRepository extends JpaRepository<DataProcessing, String> {
    boolean existsByNameIgnoreCase(String name);
    
    @Query("SELECT d.dataProcessingID FROM DataProcessing d ORDER BY d.dataProcessingID DESC LIMIT 1")
    Optional<String> findMaxDataProcessingId();
}
