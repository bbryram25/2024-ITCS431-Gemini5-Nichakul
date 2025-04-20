package com.example.GeminiProject.Controller;

import com.example.Enum.Role;
import com.example.GeminiProject.Model.Staff;
import com.example.GeminiProject.Repository.StaffRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Controller
@RequestMapping("/api")
public class GeminiController {

    @Autowired
    private StaffRepository staffRepository;

    @CrossOrigin
    @GetMapping("/home")
    public @ResponseBody String Home() {
        return "Hello Gemini";
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) throws JsonProcessingException {
        String username = body.get("username").toString();
        String password = body.get("password").toString();
        String firstName = body.get("firstName").toString();
        String lastName = body.get("lastName").toString();
        String roleString = body.get("role").toString();
        Role role;
        try {
            role = Role.valueOf(roleString);
        }
        catch (IllegalArgumentException e) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "The provided role is not valid"
            );
            problemDetail.setTitle("Invalid role");
            problemDetail.setDetail("The provided role is not valid");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail);
        }

        if (staffRepository.findByUsername(username).isPresent()) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Username already exists"
            );
            problemDetail.setTitle("Staff Registration Error");
            problemDetail.setDetail("STAFF_EXISTS");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail);
        }

        String staffId = Staff.generateStaffId(staffRepository, role);
        Staff staff = new Staff(username, password, firstName, lastName, role);
        staff.setStaffId(staffId);
        Staff savedStaff = staffRepository.save(staff);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedStaff);
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) throws JsonProcessingException {
        String username = body.get("username").toString();
        String password = body.get("password").toString();

        Optional<Staff> optionalStaff = staffRepository.findByUsername(username);

        if (optionalStaff.isEmpty()) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Username not found"
            );
            problemDetail.setTitle("Staff Login Error");
            problemDetail.setDetail("STAFF_NOT_FOUND");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail);
        }

        Staff staff = optionalStaff.get();

        if (staff.getPassword().equals(password)) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.OK,
                    "Successfully logged in"
            );
            problemDetail.setTitle("Staff Login Success");
            problemDetail.setDetail("STAFF_LOGIN_SUCCESS");
            return ResponseEntity.ok(problemDetail);
        }
        else {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Incorrect password"
            );
            problemDetail.setTitle("Staff Login Error");
            problemDetail.setDetail("STAFF_PASSWORD_INCORRECT");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail);
        }
    }

    @CrossOrigin
    @GetMapping("/staffs")
    public @ResponseBody List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }



}