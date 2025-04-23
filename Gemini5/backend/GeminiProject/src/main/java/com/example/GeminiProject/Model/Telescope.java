package com.example.GeminiProject.Model;

import com.example.GeminiProject.Enum.TelescopeStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

@Entity
public class Telescope {
    @Id
    private String telescopeID;
    private String telescopeName;
    private String description;
    private String location;
    
    @Enumerated(EnumType.STRING)
    private TelescopeStatus status;

    public Telescope() {
        this.telescopeID = "";
        this.telescopeName = "";
        this.description = "";
        this.location = "";
    }

    public Telescope(String telescopeID, String telescopeName, String description, String location, TelescopeStatus status) {
        this.telescopeID = telescopeID;
        this.telescopeName = telescopeName;
        this.description = description;
        this.location = location;
        this.status = status;
    }

    public String getTelescopeID() {
        return telescopeID;
    }
    public String getTelescopeName() {
        return telescopeName;
    }
    public String getDescription() {
        return description;
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
    public void setDescription(String description) {
        this.description = description;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public void setStatus(TelescopeStatus status) {
        this.status = status;
    }

}
