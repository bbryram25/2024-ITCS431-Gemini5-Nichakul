package com.example.GeminiProject.Model;

import com.example.GeminiProject.Enum.Role;
import com.example.GeminiProject.Repository.StaffRepository;
import jakarta.persistence.*;

import java.util.Optional;

@Entity
public class Staff {
    @Id
    private String staffId;
    private String username;
    private String password;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Role role;

    public Staff() {
        this.staffId = "";
        this.username = "";
        this.password = "";
        this.firstName = "";
        this.lastName = "";
    }

    public Staff(String username, String password, String firstName, String lastName, Role role) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public String getStaffId() {
        return staffId;
    }
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public Role getRole() {
        return role;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public void setRole(Role role) {
        this.role = role;
    }
    
    public static String generateStaffId(StaffRepository staffRepository, Role role) {
        Optional<String> maxIdOpt = staffRepository.findMaxStaffId();

        int nextId = 1;
        if (maxIdOpt.isPresent()) {
            String maxId = maxIdOpt.get();
            String numId = maxId.replaceAll("[^0-9]", "");

            if (!numId.isEmpty()) {
                nextId = Integer.parseInt(numId) + 1;
            }
        }

        String prefix = role == Role.Astronomer ? "astro" : "sciob";
        return prefix + String.format("%03d", nextId);
    }
}
