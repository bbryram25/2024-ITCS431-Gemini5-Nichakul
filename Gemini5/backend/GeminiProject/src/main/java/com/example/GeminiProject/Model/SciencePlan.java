package com.example.GeminiProject.Model;

import com.example.GeminiProject.Enum.SciencePlanStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
public class SciencePlan {

    @Id
    private String planId;

    @Enumerated(EnumType.STRING)
    private SciencePlanStatus status;

    // Getter and Setter for status
    public SciencePlanStatus getStatus() {
        return status;
    }

    public void setStatus(SciencePlanStatus status) {
        this.status = status;
    }
}
