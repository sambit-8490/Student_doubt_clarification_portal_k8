package com.doubt.platform.dto;

import lombok.Data;

public class AppDto {

    @Data
    public static class UserRequest {
        private String name;
        private String email;
        private String password;
        private String role;
        private String department;
    }

    @Data
    public static class OfficeHourRequest {
        private String date;
        private String time;
        private Boolean recurring = false;   // weekly repeat
        private Integer repeatWeeks = 1;     // how many weeks to repeat
    }

    @Data
    public static class AppointmentRequest {
        private Long officeHourId;
        private String doubt;
        private String tag; // DSA, DBMS, OS, Networks, Math, Other
    }

    @Data
    public static class StatusRequest {
        private String status;
        private String notes; // faculty session notes on complete
    }

    @Data
    public static class ReviewRequest {
        private Long appointmentId;
        private Integer rating; // 1-5
        private String comment;
    }

    @Data
    public static class ProfileRequest {
        private String name;
        private String department;
    }
}
