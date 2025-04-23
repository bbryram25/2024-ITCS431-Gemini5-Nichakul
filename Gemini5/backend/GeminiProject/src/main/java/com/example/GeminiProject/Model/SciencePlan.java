package com.example.GeminiProject.Model;

import com.example.GeminiProject.Enum.AssignedTelescope;
import com.example.GeminiProject.Enum.SciencePlanStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SciencePlan {

    @Id
    private String planId;

    private String planName;
    private String creator;
    private double funding;

    @Lob
    private String objective;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String target;
    private AssignedTelescope assignedTelescope;
    // private DataProcessing dataProcessing;

    @Enumerated(EnumType.STRING)
    private SciencePlanStatus status;

    // Getters and Setters
    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Double getFunding() {
        return funding;
    }

    public void setFunding(Double funding) {
        this.funding = funding;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public AssignedTelescope getAssignedTelescope() {
        return assignedTelescope;
    }

    public void setAssignedTelescope(AssignedTelescope assignedTelescope) {
        this.assignedTelescope = assignedTelescope;
    }

    // public DataProcessing getDataProcessing() {
    //     return dataProcessing;
    // }

    // public void setDataProcessing(DataProcessing dataProcessing) {
    //     this.dataProcessing = dataProcessing;
    // }

    public SciencePlanStatus getStatus() {
        return status;
    }

    public void setStatus(SciencePlanStatus status) {
        this.status = status;
    }
}
