package com.example.GeminiProject.Repository;

import com.example.GeminiProject.Model.SciencePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SciencePlanRepository extends JpaRepository<SciencePlan, String> {
    // You can define custom query methods here if needed
}
