package com.example.GeminiProject.Controller;

import com.example.GeminiProject.Model.Role;
import com.example.GeminiProject.Model.Staff;
import com.example.GeminiProject.Repository.StaffRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Controller;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Controller
public class GeminiController {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @CrossOrigin
    @GetMapping("/")
    public @ResponseBody String Home() {
        return "Hello Gemini";
    }

    @CrossOrigin
    @PostMapping("/register")
    public @ResponseBody String register(@RequestBody Map<String, Object> body) throws JsonProcessingException {
        String username = body.get("username").toString();
        String password = body.get("password").toString();
        String firstName = body.get("firstName").toString();
        String lastName = body.get("lastName").toString();
        String roleString = body.get("role").toString();
//        Role role = Role.valueOf(roleString);
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
            return objectMapper.writeValueAsString(problemDetail);
        }

        if (staffRepository.findByUsername(username).isPresent()) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Username already exists"
            );
            problemDetail.setTitle("Staff Registration Error");
            problemDetail.setDetail("STAFF_EXISTS");

            return objectMapper.writeValueAsString(problemDetail);
        }

        String staffId = Staff.generateStaffId(staffRepository, role);
        Staff staff = new Staff(username, password, firstName, lastName, role);
        staff.setStaffId(staffId);
        Staff savedStaff = staffRepository.save(staff);

        return objectMapper.writeValueAsString(savedStaff);
    }

    @CrossOrigin
    @PostMapping("/login")
    public @ResponseBody String login(@RequestBody Map<String, Object> body) throws JsonProcessingException {
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

            return objectMapper.writeValueAsString(problemDetail);
        }

        Staff staff = optionalStaff.get();

//        ProblemDetail problemDetail;
        if (staff.getPassword().equals(password)) {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.OK,
                    "Successfully logged in"
            );
            problemDetail.setTitle("Staff Login Success");
            problemDetail.setDetail("STAFF_LOGIN_SUCCESS");
            return objectMapper.writeValueAsString(problemDetail);
        }
        else {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Incorrect password"
            );
            problemDetail.setTitle("Staff Login Error");
            problemDetail.setDetail("STAFF_PASSWORD_INCORRECT");
            return objectMapper.writeValueAsString(problemDetail);
        }
    }

    @CrossOrigin
    @GetMapping("/staffs")
    public @ResponseBody List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

}
