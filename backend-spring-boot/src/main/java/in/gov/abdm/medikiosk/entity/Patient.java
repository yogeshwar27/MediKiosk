package in.gov.abdm.medikiosk.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "abha_number", unique = true, nullable = false, length = 32)
    private String abhaNumber;

    @Column(name = "abha_address", unique = true, nullable = false, length = 128)
    private String abhaAddress;

    @Column(name = "aadhaar_last_four", length = 8)
    private String aadhaarLastFour;

    @Column(name = "full_name", nullable = false, length = 128)
    private String fullName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false, length = 16)
    private String gender;

    @Column(name = "mobile", nullable = false, length = 20)
    private String mobile;

    @Column(name = "pin", nullable = false, length = 16)
    private String pin;

    @Column(name = "blood_group", length = 8)
    private String bloodGroup;

    @Column(name = "state", length = 64)
    private String state;

    @Column(name = "city", length = 64)
    private String city;

    @Column(name = "emergency_contact_name", length = 128)
    private String emergencyContactName;

    @Column(name = "emergency_contact_relation", length = 64)
    private String emergencyContactRelation;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Patient() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAbhaNumber() { return abhaNumber; }
    public void setAbhaNumber(String abhaNumber) { this.abhaNumber = abhaNumber; }

    public String getAbhaAddress() { return abhaAddress; }
    public void setAbhaAddress(String abhaAddress) { this.abhaAddress = abhaAddress; }

    public String getAadhaarLastFour() { return aadhaarLastFour; }
    public void setAadhaarLastFour(String aadhaarLastFour) { this.aadhaarLastFour = aadhaarLastFour; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactRelation() { return emergencyContactRelation; }
    public void setEmergencyContactRelation(String emergencyContactRelation) { this.emergencyContactRelation = emergencyContactRelation; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
