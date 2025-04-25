package com.example.GeminiProject.Controller;

import com.example.GeminiProject.Enum.ColorType;
import com.example.GeminiProject.Enum.FileQuality;
import com.example.GeminiProject.Enum.FileType;
import com.example.GeminiProject.Enum.Role;
import com.example.GeminiProject.Model.DataProcessing;
import com.example.GeminiProject.Model.Staff;
import com.example.GeminiProject.Model.Telescope;
import com.example.GeminiProject.Repository.DataProcessingRepository;
// import com.example.GeminiProject.Repository.SciencePlanRepository;
import com.example.GeminiProject.Repository.StaffRepository;
import com.example.GeminiProject.Repository.TelescopeRepository;
import com.example.GeminiProject.Response.ResponseWrapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import edu.gemini.app.ocs.model.SciencePlan;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class GeminiController {

    @Autowired
    private StaffRepository staffRepository;

    // @Autowired
    // private SciencePlanRepository sciencePlanRepository;

    @Autowired
    private TelescopeRepository telescopeRepository;

    @Autowired 
    private DataProcessingRepository dataProcessingRepository;

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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseWrapper.error("The provided role is not valid", HttpStatus.BAD_REQUEST));
        }

        if (staffRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseWrapper.error("Username already exists", HttpStatus.BAD_REQUEST));
        }

        String staffId = Staff.generateStaffId(staffRepository, role);
        Staff staff = new Staff(username, password, firstName, lastName, role);
        staff.setStaffId(staffId);
        Staff savedStaff = staffRepository.save(staff);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ResponseWrapper.success(savedStaff, "Staff registered successfully", HttpStatus.CREATED));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) throws JsonProcessingException {
        String username = body.get("username").toString();
        String password = body.get("password").toString();

        Optional<Staff> optionalStaff = staffRepository.findByUsername(username);

        if (optionalStaff.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseWrapper.error("Username does not exist", HttpStatus.BAD_REQUEST));
        }

        Staff staff = optionalStaff.get();

        if (staff.getPassword().equals(password)) {
            return ResponseEntity.ok(ResponseWrapper.success(staff, "Login successful", HttpStatus.OK));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseWrapper.error("Incorrect password", HttpStatus.BAD_REQUEST));
        }
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/staffs")
    public ResponseEntity<?> getAllStaff() {
        List<Staff> staffs = staffRepository.getAllStaff();
        if (staffs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("No staffs found", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ResponseWrapper.success(staffs, "Staffs retrieved successfully", HttpStatus.OK));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/staff/{id}")
    public ResponseEntity<?> getStaffById(@PathVariable("id") String id) {
        Staff staff = staffRepository.getStaffById(id).orElse(null);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("Staff not found", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ResponseWrapper.success(staff, "Staff retrieved successfully", HttpStatus.OK));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @DeleteMapping("/deleteStaff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable("id") String id) {
        Staff staff = staffRepository.getStaffById(id).orElse(null);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("Staff not found", HttpStatus.NOT_FOUND));
        }
        staffRepository.delete(staff);
        return ResponseEntity.ok(ResponseWrapper.success(staff, "Staff deleted successfully", HttpStatus.OK));
    }


    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/telescopes")
    public ResponseEntity<?> getAllTelescope() {
        List<Telescope> telescopes = telescopeRepository.findAll();
        if (telescopes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("No telescope found", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ResponseWrapper.success(telescopes, "Telescope retrieved successfully", HttpStatus.OK));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/telescope/{id}")
    public ResponseEntity<?> getTelescopeById(@PathVariable("id") String id) {
        Telescope telescope = telescopeRepository.findById(id).orElse(null);
        if (telescope == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("Telescope not found", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ResponseWrapper.success(telescope, "Telescope retrieved successfully", HttpStatus.OK));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/createTelescope")
    public ResponseEntity<?> createTelescope(@RequestBody Map<String, Object> body){
        String telescopeId = Telescope.generateTelescopeId(telescopeRepository);
        String telescopeName = body.get("telescopeName").toString();
        String designation = body.get("designation").toString();
        String location = body.get("location").toString();
        Telescope telescope = new Telescope(telescopeId, telescopeName, designation, location);
        telescopeRepository.save(telescope);
        return ResponseEntity.ok(ResponseWrapper.success(telescope, "Telescope created successfully", HttpStatus.CREATED));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @DeleteMapping("/deleteTelescope/{id}")
    public ResponseEntity<?> deleteTelescope(@PathVariable("id") String id) {
        Telescope telescope = telescopeRepository.findById(id).orElse(null);
        if (telescope == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("Telescope not found", HttpStatus.NOT_FOUND));
        }
        telescopeRepository.delete(telescope);
        return ResponseEntity.ok(ResponseWrapper.success(telescope, "Telescope deleted successfully", HttpStatus.OK));
    }


    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/dataProcessings")
    public ResponseEntity<?> getAllDataProcessing() {
        List<DataProcessing> dataProcessings = dataProcessingRepository.findAll();
        if (dataProcessings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("No data processing found", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ResponseWrapper.success(dataProcessings, "Data processing retrieved successfully", HttpStatus.OK));
    }

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @GetMapping("/dataProcessing/{id}")
    public ResponseEntity<?> getDataProcessingById(@PathVariable("id") String id) {
        DataProcessing dataProcessing = dataProcessingRepository.findById(id).orElse(null);
        if (dataProcessing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseWrapper.notFound("Data processing not found", HttpStatus.NOT_FOUND));
        }
        return ResponseEntity.ok(ResponseWrapper.success(dataProcessing, "Data processing retrieved successfully", HttpStatus.OK));
    }    

    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    @PostMapping("/createDataProcessing")
    public ResponseEntity<?> createDataProcessing(@RequestBody Map<String, Object> body) {
        try {
            String name = body.get("name").toString();

            List<DataProcessing> existingDataProcessings = dataProcessingRepository.findAll();
            boolean nameExists = existingDataProcessings.stream()
                .anyMatch(dp -> dp.getName().equalsIgnoreCase(name));

            if (nameExists) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseWrapper.error("Data processing name already exists", HttpStatus.BAD_REQUEST));
            }

            String dataProcessingId = DataProcessing.generateDataProcessingId(dataProcessingRepository);
            String fileType = body.get("fileType").toString();
            String fileQuality = body.get("fileQuality").toString();
            String colorType = body.get("colorType").toString();
            double contrast = Double.parseDouble(body.get("contrast").toString());
            double brightness = Double.parseDouble(body.get("brightness").toString());
            double saturation = Double.parseDouble(body.get("saturation").toString());
            double highlights = Double.parseDouble(body.get("highlights").toString());
            double exposure = Double.parseDouble(body.get("exposure").toString());
            double shadows = Double.parseDouble(body.get("shadows").toString());
            double whites = Double.parseDouble(body.get("whites").toString());
            double blacks = Double.parseDouble(body.get("blacks").toString());
            double luminance = Double.parseDouble(body.get("luminance").toString());
            double hue = Double.parseDouble(body.get("hue").toString());

            DataProcessing dataProcessing = new DataProcessing(
                dataProcessingId, 
                name, 
                FileType.valueOf(fileType), 
                FileQuality.valueOf(fileQuality), 
                ColorType.valueOf(colorType), 
                contrast, 
                brightness, 
                saturation, 
                highlights, 
                exposure, 
                shadows, 
                whites, 
                blacks, 
                luminance, 
                hue
            );
            
            dataProcessingRepository.save(dataProcessing);
            return ResponseEntity.ok(ResponseWrapper.success(dataProcessing, "Data processing created successfully", HttpStatus.CREATED));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ResponseWrapper.error("Error creating data processing: " + e.getMessage(), HttpStatus.BAD_REQUEST));
        }
    }

}
