package in.gov.abdm.medikiosk.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "reg_number", unique = true, nullable = false, length = 64)
    private String regNumber;

    @Column(name = "full_name", nullable = false, length = 128)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false, length = 128)
    private String email;

    @Column(name = "password", nullable = false, length = 128)
    private String password;

    @Column(name = "specialty", nullable = false, length = 64)
    private String specialty;

    @Column(name = "hospital_name", nullable = false, length = 128)
    private String hospitalName;

    @Column(name = "department", nullable = false, length = 64)
    private String department;

    @Column(name = "room_number", nullable = false, length = 32)
    private String roomNumber;

    @Column(name = "duty_shift", length = 32)
    private String dutyShift = "Morning (08:00 - 14:00)";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Doctor() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRegNumber() { return regNumber; }
    public void setRegNumber(String regNumber) { this.regNumber = regNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getDutyShift() { return dutyShift; }
    public void setDutyShift(String dutyShift) { this.dutyShift = dutyShift; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
