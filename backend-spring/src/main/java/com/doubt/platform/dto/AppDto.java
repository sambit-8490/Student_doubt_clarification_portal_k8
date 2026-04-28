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
    }

    @Data
    public static class AppointmentRequest {
        private Long officeHourId;
        private String doubt;
    }

    @Data
    public static class StatusRequest {
        private String status;
    }
}
