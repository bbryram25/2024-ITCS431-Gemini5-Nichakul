package com.example.GeminiProject.Model;

import java.util.Optional;

import com.example.GeminiProject.Enum.TelescopeStatus;
import com.example.GeminiProject.Repository.TelescopeRepository;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

@Entity
public class Telescope {
    @Id
    private String telescopeID;
    private String telescopeName;
    private String designation;
    private String location;
    
    @Enumerated(EnumType.STRING)
    private TelescopeStatus status;

    public Telescope() {
        this.telescopeID = "";
        this.telescopeName = "";
        this.designation = "";
        this.location = "";
    }

    public Telescope(String telescopeID, String telescopeName, String description, String location) {
        this.telescopeID = telescopeID;
        this.telescopeName = telescopeName;
        this.designation = description;
        this.location = location;
        this.status = TelescopeStatus.IDEL;
    }

    public String getTelescopeID() {
        return telescopeID;
    }
    public String getTelescopeName() {
        return telescopeName;
    }
    public String getDesignation() {
        return designation;
    }
    public String getLocation() {
        return location;
    }
    public TelescopeStatus getStatus() {
        return status;
    }
    
    public void setTelescopeID(String telescopeID) {
        this.telescopeID = telescopeID;
    }
    public void setTelescopeName(String telescopeName) {
        this.telescopeName = telescopeName;
    }
    public void setDesignation(String description) {
        this.designation = description;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public void setStatus(TelescopeStatus status) {
        this.status = status;
    }

    public static String generateTelescopeId(TelescopeRepository telescopeRepository) {
        Optional<String> maxIdOpt = telescopeRepository.findMaxTelescopeId();

        int nextId = 1;
        if (maxIdOpt.isPresent()) {
            String maxId = maxIdOpt.get();
            String numId = maxId.replaceAll("[^0-9]", "");

            if (!numId.isEmpty()) {
                nextId = Integer.parseInt(numId) + 1;
            }
        }

        String prefix = "tl-";
        return prefix + String.format("%03d", nextId);
    }

}
