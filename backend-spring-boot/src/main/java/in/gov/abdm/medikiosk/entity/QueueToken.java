package in.gov.abdm.medikiosk.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tokens")
public class QueueToken {

    @Id
    @Column(name = "id", length = 64)
    private String id;

    @Column(name = "token_number", unique = true, nullable = false, length = 32)
    private String tokenNumber;

    @Column(name = "patient_id", nullable = false, length = 64)
    private String patientId;

    @Column(name = "patient_name", nullable = false, length = 128)
    private String patientName;

    @Column(name = "abha_number", nullable = false, length = 32)
    private String abhaNumber;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false, length = 16)
    private String gender;

    @Column(name = "chief_complaint", nullable = false, columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(name = "primary_language", length = 32)
    private String primaryLanguage = "English";

    @Column(name = "priority", nullable = false, length = 16)
    private String priority = "P3"; // P1 (Emergency), P2 (Urgent), P3 (Routine)

    @Column(name = "status", nullable = false, length = 32)
    private String status = "WAITING"; // WAITING, IN_CONSULTATION, COMPLETED

    @Column(name = "assigned_room", nullable = false, length = 32)
    private String assignedRoom;

    @Column(name = "assigned_doctor", length = 128)
    private String assignedDoctor;

    @Column(name = "department", nullable = false, length = 64)
    private String department;

    @Column(name = "turn_count")
    private Integer turnCount = 1;

    @Column(name = "time_saved_minutes")
    private Integer timeSavedMinutes = 7;

    @Column(name = "summary_snapshot", columnDefinition = "TEXT")
    private String summarySnapshot;

    @Column(name = "hpi_narrative", columnDefinition = "TEXT")
    private String hpiNarrative;

    @Column(name = "past_history", columnDefinition = "TEXT")
    private String pastHistory;

    @Column(name = "suggested_workup", columnDefinition = "TEXT")
    private String suggestedWorkup;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public QueueToken() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getAbhaNumber() { return abhaNumber; }
    public void setAbhaNumber(String abhaNumber) { this.abhaNumber = abhaNumber; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getPrimaryLanguage() { return primaryLanguage; }
    public void setPrimaryLanguage(String primaryLanguage) { this.primaryLanguage = primaryLanguage; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedRoom() { return assignedRoom; }
    public void setAssignedRoom(String assignedRoom) { this.assignedRoom = assignedRoom; }

    public String getAssignedDoctor() { return assignedDoctor; }
    public void setAssignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getTurnCount() { return turnCount; }
    public void setTurnCount(Integer turnCount) { this.turnCount = turnCount; }

    public Integer getTimeSavedMinutes() { return timeSavedMinutes; }
    public void setTimeSavedMinutes(Integer timeSavedMinutes) { this.timeSavedMinutes = timeSavedMinutes; }

    public String getSummarySnapshot() { return summarySnapshot; }
    public void setSummarySnapshot(String summarySnapshot) { this.summarySnapshot = summarySnapshot; }

    public String getHpiNarrative() { return hpiNarrative; }
    public void setHpiNarrative(String hpiNarrative) { this.hpiNarrative = hpiNarrative; }

    public String getPastHistory() { return pastHistory; }
    public void setPastHistory(String pastHistory) { this.pastHistory = pastHistory; }

    public String getSuggestedWorkup() { return suggestedWorkup; }
    public void setSuggestedWorkup(String suggestedWorkup) { this.suggestedWorkup = suggestedWorkup; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
